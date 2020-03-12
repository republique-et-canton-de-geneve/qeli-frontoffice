import { Component, ComponentFactoryResolver, Inject, Input, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionBase } from '../question/question-base.model';
import { QuestionDirective } from '../question/question.directive';
import { QuestionComponent } from '../question/question.component';
import { QuestionRegistry } from '../question/question-registry';
import { TrackingService } from '../../service/tracking.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-dynamic-question',
  templateUrl: './dynamic-question.component.html',
  styleUrls: ['./dynamic-question.component.scss']
})
export class DynamicQuestionComponent {
  @Input() form: FormGroup;
  question: QuestionBase<any>;

  @ViewChild(QuestionDirective, {static: true}) questionDirective: QuestionDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private trackingService: TrackingService,
              @Inject(DOCUMENT) document) {

  }

  @Input("question")
  set loadQuestion(question: QuestionBase<any>) {
    this.question = question;
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

  loadComponent() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      QuestionRegistry[this.question.controlType]
    );
    const viewContainerRef = this.questionDirective.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);
    (<QuestionComponent<any>>componentRef.instance).form = this.form;
    (<QuestionComponent<any>>componentRef.instance).question = this.question;

    this.trackingService.trackQuestion(this.question, document.getElementById('formElement'));
  }
}
