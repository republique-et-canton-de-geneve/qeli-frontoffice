import { Component, Input } from '@angular/core';
import { QuestionComponent } from '../question.component';
import { FormGroup } from '@angular/forms';
import { NumberField, NumberGroupQuestion } from './number-group-question.model';
import { RegisterQuestionComponent } from '../question-registry';

@RegisterQuestionComponent(new NumberGroupQuestion().controlType)
@Component({
  selector: 'app-number-group-question',
  templateUrl: './number-group-question.component.html',
  styleUrls: ['./number-group-question.component.scss']
})
export class NumberGroupQuestionComponent implements QuestionComponent<any> {
  @Input() question: NumberGroupQuestion;
  @Input() form: FormGroup;

  get isNoneSelected() {
    return !!this.formGroup.value['none'];
  }

  private get formGroup() {
    return this.form.controls[this.question.key] as FormGroup;
  }

  private get valuesFormGroup() {
    return this.formGroup.controls['values'] as FormGroup;
  }

  onNoneChanged() {
    if (this.isNoneSelected) {
      this.clearChoices();
    }

    this.formGroup.markAsPristine();
  }

  isNumber(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;
    console.log(target.value);
    if (event.key === '-' && target.value.length > 0) {
      return false;
    }

    if (target.value.startsWith('-') && target.value.length >= 3) {
      return false;
    }

    if (!target.value.startsWith('-') && target.value.length >= 2) {
      return false;
    }

    return /[-\d]/.test(event.key);
  }

  private clearChoices() {
    this.question.fields.forEach((field) => {
      this.valuesFormGroup.controls[field.label].setValue(null);
    });
  }

  isValid(field: NumberField) {
    return this.valuesFormGroup.controls[field.label].pristine ||
           this.valuesFormGroup.controls[field.label].valid;
  }

  getErrorsByField(field: NumberField) {
    return !this.isValid(field) ? Object.keys(this.valuesFormGroup.controls[field.label].errors) : null;
  }
}
