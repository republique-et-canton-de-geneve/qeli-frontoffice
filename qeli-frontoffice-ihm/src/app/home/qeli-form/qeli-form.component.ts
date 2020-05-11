import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToAnswerVisitor } from '../../dynamic-question/model/to-answer.visitor.model';
import { QeliStateMachine } from '../../service/question/qeli-state.model';
import { DynamicQuestionComponent } from '../../dynamic-question/dynamic-question.component';

@Component({
  selector: 'app-qeli-form',
  templateUrl: './qeli-form.component.html',
  styleUrls: ['./qeli-form.component.scss']
})
export class QeliFormComponent implements OnInit {

  @ViewChild('formElement', {static: false}) formElement: ElementRef;
  @ViewChild('dynamicQuestionComponent', {static: false}) dynamicQuestionComponent: DynamicQuestionComponent;

  @Input() qeliStateMachine: QeliStateMachine;

  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    const questions = this.qeliStateMachine.questions.map(decorator => decorator.question);
    const formData = this.qeliStateMachine.state.formData;

    let group: any = {};

    questions.forEach(question => {
      group[question.key] = question.toFormControl(formData ? formData[question.key] : null);
    });

    this.form = this.formBuilder.group(group);
  }

  isCurrentQuestionValid() {
    return this.form.controls[this.currentQuestion.key].valid;
  }

  get currentAnswer() {
    if (this.isCurrentQuestionValid()) {
      const currentQuestion = this.currentQuestion;
      return currentQuestion.accept(new ToAnswerVisitor(this.form.value, currentQuestion.key));
    }

    return null;
  }

  get currentQuestion() {
    const questionDecorator = this.qeliStateMachine.currentQuestion;
    return questionDecorator !== null ? questionDecorator.question : null;
  }

  displayErrors() {
    this.dynamicQuestionComponent.displayErrors();
  }
}
