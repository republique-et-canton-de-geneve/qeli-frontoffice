import { Component, Input } from '@angular/core';
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

  isNumber(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;
    return /[\d,]/.test(event.key);
  }

  onTypeOfInputChanged() {
    this.formGroup.controls['value'].setValue(null);
    this.formGroup.markAsPristine();
  }

  get weeklyTaux() {
    if (this.isHourlyInputSelected) {
      const value = this.formGroup.controls['value'].value;
      if (value || value === 0) {
        const percentage = value / this.question.workingHoursByWeek * 100
        return Math.round(percentage * 10) / 10;
      }
    }
    return null;
  }

  get isHourlyInputSelected() {
    return !!this.formGroup.value['isHourly'];
  }

  private get formGroup() {
    return this.form.controls[this.question.key] as FormGroup;
  }

  get isValid() {
    return this.form.controls[this.question.key].pristine ||
           this.form.controls[this.question.key].valid;
  }
}

