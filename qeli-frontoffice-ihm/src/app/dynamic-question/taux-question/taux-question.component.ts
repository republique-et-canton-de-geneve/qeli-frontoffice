import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { QuestionComponent } from '../model/question.component';
import { TAUX_CONTROL_TYPE, TauxQuestion } from './taux-question.model';
import { FormGroup } from '@angular/forms';
import { RegisterQuestionComponent } from '../model/question-registry.model';
import { NumberAnswer } from '../model/answer.model';

@RegisterQuestionComponent(TAUX_CONTROL_TYPE)
@Component({
  selector: 'app-text-question',
  templateUrl: './taux-question.component.html',
  styleUrls: ['./taux-question.component.scss']
})
export class TauxQuestionComponent implements QuestionComponent<NumberAnswer> {
  @Input() question: TauxQuestion;
  @Input() form: FormGroup;
  @Input() disableFocusOnInit: boolean;

  options = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10];

  isNumber(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;

    if (event.key === ',' && target.value.includes(',')) {
      return false;
    }

    return /[\d,]/.test(event.key);
  }

  onOtherChanged() {
    this.formGroup.controls['taux'].setValue(null);
  }

  get isOtherSelected() {
    return !!this.formGroup.value['other'];
  }

  private get formGroup() {
    return this.form.controls[this.question.key] as FormGroup;
  }

  get isValid() {
    return this.form.controls[this.question.key].pristine ||
           this.form.controls[this.question.key].valid;
  }
}

