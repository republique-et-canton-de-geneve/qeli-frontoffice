import { Component, Input } from '@angular/core';
import { QuestionComponent } from '../question.component';
import { FormGroup } from '@angular/forms';
import { EnfantsAChargeField, EnfantsAChargeQuestion } from './enfants-a-charge-question.model';
import { RegisterQuestionComponent } from '../question-registry';

@RegisterQuestionComponent(new EnfantsAChargeQuestion().controlType)
@Component({
  selector: 'app-enfants-a-charge-question',
  templateUrl: './enfants-a-charge-question.component.html',
  styleUrls: ['./enfants-a-charge-question.component.scss']
})
export class EnfantsAChargeQuestionComponent implements QuestionComponent<string> {
  @Input() question: EnfantsAChargeQuestion;
  @Input() form: FormGroup;

  get isNoneSelected() {
    return !!this.formGroup.value['none'];
  }

  private get formGroup() {
    return this.form.controls[this.question.key] as FormGroup;
  }

  onNoneChanged() {
    if (this.isNoneSelected) {
      this.clearChoices();
    }

    this.formGroup.markAsPristine();
  }

  private clearChoices() {
    this.question.fields.forEach((field) => {
      this.formGroup.controls[field.label].setValue(null);
    });
  }

  isValid(field: EnfantsAChargeField) {
    return this.formGroup.controls[field.label].pristine ||
           this.formGroup.controls[field.label].valid;
  }

  get errors() {
    let errors = {};
    this.question.fields.forEach((field) => {
      if (!this.formGroup.controls[field.label].valid) {
        errors[field.label] = Object.keys(this.formGroup.controls[field.label].errors);
      }
    });
    return errors;
  }
}
