import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { QuestionBase } from '../question/question-base.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
      group[question.key] = question.required ? new FormControl(question.defaultValue || '', Validators.required)
                                              : new FormControl(question.defaultValue || '');
    });

    this.form = new FormGroup(group);
  }

  isValid(question: QuestionBase<any>) {
    return this.form.controls[question.key].valid;
  }

  nextQuestion() {
    if (this.currentQuestionIndex + 1 < this.questions.length) {
      this.currentQuestionIndex++;
    } else {
      this.onSubmit.emit(this.form.value);
    }
  }
}
