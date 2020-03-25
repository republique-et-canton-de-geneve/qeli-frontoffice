import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { QuestionComponent } from '../question.component';
import { TextQuestion } from './text-question.model';
import { FormGroup } from '@angular/forms';
import { RegisterQuestionComponent } from '../question-registry';

@RegisterQuestionComponent(new TextQuestion().controlType)
@Component({
  selector: 'app-text-question',
  templateUrl: './text-question.component.html',
  styleUrls: ['./text-question.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextQuestionComponent implements QuestionComponent<string> {
  @Input() question: TextQuestion;
  @Input() form: FormGroup;
}

