import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { QuestionComponent } from '../model/question.component';
import { FormGroup } from '@angular/forms';
import { NUMBER_GROUP_CONTROL_TYPE, NumberField, NumberGroupQuestion } from './number-group-question.model';
import { RegisterQuestionComponent } from '../model/question-registry.model';

@RegisterQuestionComponent(NUMBER_GROUP_CONTROL_TYPE)
@Component({
  selector: 'app-number-group-question',
  templateUrl: './number-group-question.component.html',
  styleUrls: ['./number-group-question.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
      this.valuesFormGroup.controls[field.key].setValue(null);
    });
  }

  isValid(field: NumberField) {
    return this.valuesFormGroup.controls[field.key].pristine ||
           this.valuesFormGroup.controls[field.key].valid;
  }

  getErrorsByField(field: NumberField) {
    return !this.isValid(field) ? Object.keys(this.valuesFormGroup.controls[field.key].errors) : null;
  }
}
