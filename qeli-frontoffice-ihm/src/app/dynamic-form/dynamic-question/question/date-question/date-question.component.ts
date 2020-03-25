import { AfterViewInit, ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { QuestionComponent } from '../question.component';
import { DateAnswer, DateQuestion } from './date-question.model';
import { FormGroup } from '@angular/forms';
import { RegisterQuestionComponent } from '../question-registry';
import { QuestionOption } from '../option.model';
import { DateInputComponent } from '../../../../ge-forms/date-input/date-input.component';

@RegisterQuestionComponent(new DateQuestion().controlType)
@Component({
  selector: 'app-date-question',
  templateUrl: './date-question.component.html',
  styleUrls: ['./date-question.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateQuestionComponent implements QuestionComponent<DateAnswer>, AfterViewInit {
  @ViewChild('dateInputComponent', {static: true}) dateInputComponent: DateInputComponent;

  @Input() question: DateQuestion;
  @Input() form: FormGroup;

  ngAfterViewInit(): void {
    if (this.dateControl.value) {
      this.dateInputComponent.setTextInputData(this.dateControl.value);
    }
  }

  onShortcutChanged(checked: boolean, shortcut: QuestionOption) {
    if (checked && shortcut !== null) {
      this.dateControl.setValue(null);
    }

    this.dateControl.markAsPristine();
  }

  private get formGroup() {
    return this.form.controls[this.question.key] as FormGroup;
  }

  get dateControl() {
    return this.formGroup.controls['value'];
  }

  get isShortcutSelected() {
    return this.formGroup.value['shortcut'] !== null &&
           this.formGroup.value['shortcut'] !== undefined;
  }

  get isDateValid() {
    return this.dateControl.pristine || this.dateControl.valid;
  }

  get dateErrors() {
    return !this.isDateValid ? Object.keys(this.dateControl.errors) : null;
  }
}
