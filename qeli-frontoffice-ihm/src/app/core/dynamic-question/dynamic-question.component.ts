import { Component, ComponentFactoryResolver, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionBase } from '../question/question-base.model';
import { QuestionDirective } from '../question/question.directive';
import { QuestionComponent } from '../question/question.component';
import { QuestionRegistry } from '../question/question-registry';

@Component({
  selector: 'app-dynamic-question',
  templateUrl: './dynamic-question.component.html',
  styleUrls: ['./dynamic-question.component.scss']
})
export class DynamicQuestionComponent implements OnInit {
  @Input() question: QuestionBase<any>;
  @Input() form: FormGroup;

  @ViewChild(QuestionDirective) questionDirective: QuestionDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {

  }

  ngOnInit() {
    this.loadComponent();
  }

  get isValid() {
    return this.form.controls[this.question.key].untouched ||
           this.form.controls[this.question.key].valid;
  }

  get errors() {
    return Object.keys(this.form.controls[this.question.key].errors);
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
  }
}
