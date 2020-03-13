import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { QuestionComponent } from '../question.component';
import { NumberQuestion } from './number-question.model';
import { FormGroup } from '@angular/forms';
import { RegisterQuestionComponent } from '../question-registry';

@RegisterQuestionComponent(new NumberQuestion().controlType)
@Component({
  selector: 'app-text-question',
  templateUrl: './number-question.component.html',
  styleUrls: ['./number-question.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NumberQuestionComponent implements QuestionComponent<number> {
  @Input() question: NumberQuestion;
  @Input() form: FormGroup;

  isNumber(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;

    if (event.key === '-' && (this.question.min >= 0 || target.value.length > 0)) {
      return false;
    }

    if (event.key === ',' && (!this.question.showDecimals || target.value.includes(','))) {
      return false;
    }

    if (this.question.showDecimals) {
      return /[-\d,]/.test(event.key);
    } else {
      return /[-\d]/.test(event.key);
    }
  }

}

