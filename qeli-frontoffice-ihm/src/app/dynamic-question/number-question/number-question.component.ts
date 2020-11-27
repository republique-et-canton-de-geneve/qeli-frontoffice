import { Component, Input } from '@angular/core';
import { QuestionComponent } from '../model/question.component';
import { NUMBER_GROUP_TYPE, NumberQuestion } from './number-question.model';
import { FormGroup } from '@angular/forms';
import { RegisterQuestionComponent } from '../model/question-registry.model';
import { NumberAnswer } from '../model/answer.model';

@RegisterQuestionComponent(NUMBER_GROUP_TYPE)
@Component({
  selector: 'app-text-question',
  templateUrl: './number-question.component.html',
  styleUrls: ['./number-question.component.scss']
})
export class NumberQuestionComponent implements QuestionComponent<NumberAnswer> {
  @Input() question: NumberQuestion;
  @Input() form: FormGroup;
  @Input() disableFocusOnInit: boolean;

  get isValid() {
    return this.form.controls[this.question.key].pristine ||
           this.form.controls[this.question.key].valid;
  }
}

