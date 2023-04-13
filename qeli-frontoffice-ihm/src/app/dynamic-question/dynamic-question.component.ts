/*
 * qeli-frontoffice
 *
 * Copyright (C) 2019-2021 Republique et canton de Geneve
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Component, ComponentFactoryResolver, ElementRef, Input, ViewChild } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { QuestionDirective } from './model/question.directive';
import { QuestionComponent } from './model/question.component';
import { QuestionRegistryModel } from './model/question-registry.model';
import { Question } from './model/question.model';
import { I18nString } from '../core/i18n/i18nstring.model';
import { FormUtils } from '../ge-forms/form-utils';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dynamic-question',
  templateUrl: './dynamic-question.component.html',
  styleUrls: ['./dynamic-question.component.scss']
})
export class DynamicQuestionComponent {
  formGroup: UntypedFormGroup;
  @Input() disableFocusOnInit: boolean = false;
  @Input() disableDeepLink: boolean = false;

  question: Question<any>;
  label: I18nString;
  help: I18nString;
  introduction: I18nString;
  extraHelp: I18nString;
  questionValueChangeSubscription: Subscription;

  @ViewChild(QuestionDirective, {static: true}) questionDirective: QuestionDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private elementRef: ElementRef) {

  }

  @Input("question")
  set loadQuestion(question: Question<any>) {
    this.question = question;

    this.label = this.resolveI18nString(question.label);
    this.help = this.resolveI18nString(question.help);
    this.introduction = this.resolveI18nString(question.introduction);
    this.extraHelp = this.resolveI18nString(question.extraHelp);

    this.loadOnValueChangeSubscription();
    this.loadComponent();
  }

  @Input()
  set form(form: UntypedFormGroup) {
    this.formGroup = form;
    this.loadComponent();
  }

  private loadOnValueChangeSubscription() {
    if (this.questionValueChangeSubscription) {
      this.questionValueChangeSubscription.unsubscribe();
    }
    if (this.question.onValueChanged) {
      this.questionValueChangeSubscription = this.formGroup.valueChanges.subscribe(
        () => this.question.onValueChanged(this.formGroup)
      );
    }
  }

  get isValid() {
    return this.formGroup.controls[this.question.key].pristine ||
           this.formGroup.controls[this.question.key].valid;
  }

  get errors() {
    const errors = this.formGroup.controls[this.question.key].errors;
    return errors ? Object.keys(errors) : [];
  }

  private resolveI18nString(stringOrFn: I18nString | ((value: any) => I18nString)): I18nString {
    if (typeof stringOrFn === 'function') {
      return (stringOrFn as ((value: any) => I18nString))(this.formGroup.value);
    }

    return stringOrFn as I18nString;
  }

  private loadComponent() {
    if (this.formGroup && this.question) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
        QuestionRegistryModel[this.question.controlType]
      );
      const viewContainerRef = this.questionDirective.viewContainerRef;
      viewContainerRef.clear();

      const componentRef = viewContainerRef.createComponent(componentFactory);
      (<QuestionComponent<any>>componentRef.instance).form = this.formGroup;
      (<QuestionComponent<any>>componentRef.instance).question = this.question;
      (<QuestionComponent<any>>componentRef.instance).disableFocusOnInit = this.disableFocusOnInit;
    }
  }

  displayErrors() {
    FormUtils.markAllAsDirty(this.formGroup.controls[this.question.key]);
    setTimeout(() => {
      const formGroupInvalid = this.elementRef.nativeElement.querySelectorAll(
        'input[aria-invalid]:not([aria-invalid="false"]),' +
        'select[aria-invalid]:not([aria-invalid="false"]),' +
        '*[aria-invalid]:not([aria-invalid="false"]) input,' +
        '*[aria-invalid]:not([aria-invalid="false"]) select'
      );
      if (formGroupInvalid.length > 0) {
        (<HTMLInputElement>formGroupInvalid[0]).focus();
      }
    });
  }
}
