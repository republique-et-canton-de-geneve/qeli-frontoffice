import { Component, Input } from '@angular/core';
import { QuestionComponent } from '../question.component';
import { DateQuestion } from './date-question.model';
import { FormGroup } from '@angular/forms';
import { RegisterQuestionComponent } from '../question-registry';

@RegisterQuestionComponent(new DateQuestion().controlType)
@Component({
  selector: 'app-date-question',
  templateUrl: './date-question.component.html',
  styleUrls: ['./date-question.component.scss']
})
export class DateQuestionComponent implements QuestionComponent<Date> {
  @Input() question: DateQuestion;
  @Input() form: FormGroup;
}
