import { Component, Input } from '@angular/core';
import { QuestionComponent } from '../question.component';
import { DropdownQuestion } from './dropdown-question.model';
import { FormGroup } from '@angular/forms';
import { RegisterQuestionComponent } from '../question-registry';

@RegisterQuestionComponent(new DropdownQuestion().controlType)
@Component({
  selector: 'app-dropdown-question',
  templateUrl: './dropdown-question.component.html',
  styleUrls: ['./dropdown-question.component.scss']
})
export class DropdownQuestionComponent implements QuestionComponent<string[]> {
  @Input() question: DropdownQuestion;
  @Input() form: FormGroup;
}
