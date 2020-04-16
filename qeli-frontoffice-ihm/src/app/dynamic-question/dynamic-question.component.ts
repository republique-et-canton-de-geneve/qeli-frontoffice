import { Component, ComponentFactoryResolver, Input, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionDirective } from './model/question.directive';
import { QuestionComponent } from './model/question.component';
import { QuestionRegistryModel } from './model/question-registry.model';
import { Question } from './model/question.model';
import { I18nString } from '../core/i18n/i18nstring.model';

@Component({
  selector: 'app-dynamic-question',
  templateUrl: './dynamic-question.component.html',
  styleUrls: ['./dynamic-question.component.scss']
})
export class DynamicQuestionComponent {
  @Input() form: FormGroup;
  @Input() disableDeepLink: boolean = false;

  question: Question<any>;
  label: I18nString;
  help: I18nString;

  @ViewChild(QuestionDirective, {static: true}) questionDirective: QuestionDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {

  }

  @Input("question")
  set loadQuestion(question: Question<any>) {
    this.question = question;
    this.label = this.resolveI18nString(question.label);
    this.help = this.resolveI18nString(question.help);
    this.loadComponent();
  }

  get isValid() {
    return this.form.controls[this.question.key].pristine ||
           this.form.controls[this.question.key].valid;
  }

  get errors() {
    const errors = this.form.controls[this.question.key].errors;
    return errors ? Object.keys(errors) : [];
  }

  private resolveI18nString(stringOrFn: I18nString | ((value: any) => I18nString)): I18nString {
    if (typeof stringOrFn === 'function') {
      return (stringOrFn as ((value: any) => I18nString))(this.form.value);
    }

    return stringOrFn as I18nString;
  }

  private loadComponent() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      QuestionRegistryModel[this.question.controlType]
    );
    const viewContainerRef = this.questionDirective.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);
    (<QuestionComponent<any>>componentRef.instance).form = this.form;
    (<QuestionComponent<any>>componentRef.instance).question = this.question;
  }
}
