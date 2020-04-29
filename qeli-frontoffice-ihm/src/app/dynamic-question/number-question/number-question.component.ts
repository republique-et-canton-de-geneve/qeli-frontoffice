import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
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

  get isValid() {
    return this.form.controls[this.question.key].pristine ||
           this.form.controls[this.question.key].valid;
  }
}

