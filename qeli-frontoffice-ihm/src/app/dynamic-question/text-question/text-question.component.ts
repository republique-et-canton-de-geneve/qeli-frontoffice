import { Component, Input } from '@angular/core';
import { QuestionComponent } from '../model/question.component';
import { TEXT_CONTROL_TYPE, TextQuestion } from './text-question.model';
import { FormGroup } from '@angular/forms';
import { RegisterQuestionComponent } from '../model/question-registry.model';
import { StringAnswer } from '../model/answer.model';

@RegisterQuestionComponent(TEXT_CONTROL_TYPE)
@Component({
  selector: 'app-text-question',
  templateUrl: './text-question.component.html',
  styleUrls: ['./text-question.component.scss']
})
export class TextQuestionComponent implements QuestionComponent<StringAnswer> {
  @Input() question: TextQuestion;
  @Input() form: FormGroup;
  @Input() disableFocusOnInit: boolean;

  get isValid() {
    return this.form.controls[this.question.key].pristine ||
           this.form.controls[this.question.key].valid;
  }
}

