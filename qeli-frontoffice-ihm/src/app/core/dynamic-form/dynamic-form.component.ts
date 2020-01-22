import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { QuestionBase } from '../question/question-base.model';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {

  @Input() questions: QuestionBase<any>[] = [];
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();

  form: FormGroup;
  currentQuestionIndex = 0;

  constructor() {

  }

  ngOnInit() {
    let group: any = {};

    this.questions.forEach(question => {
      group[question.key] = question.toFormControl();
    });

    this.form = new FormGroup(group);
  }

  isValid(question: QuestionBase<any>) {
    return this.form.controls[question.key].valid;
  }

  nextQuestion() {
    if (this.isValid(this.currentQuestion)) {
      const nextIndex = this.questions.findIndex(
        ((value, index) => index > this.currentQuestionIndex && !value.skip(this.form))
      );

      if (nextIndex === -1) {
        this.currentQuestionIndex = this.questions.length - 1;
        this.onSubmit.emit(this.form.value);
      } else {
        this.currentQuestionIndex = nextIndex;
      }
    }
  }

  previousQuestion() {
    const reverseIndex = this.questions.slice(0, this.currentQuestionIndex).reverse().findIndex(
      (value) => !value.skip(this.form)
    );

    this.currentQuestionIndex = reverseIndex === -1 ? 0 : this.currentQuestionIndex - reverseIndex - 1;
  }

  onKeyUp(event: KeyboardEvent) {
    if (event.key === "Enter" && this.isValid(this.currentQuestion)) {
      this.nextQuestion();
    }
  }

  get currentQuestion() {
    return this.questions[this.currentQuestionIndex];
  }
}
