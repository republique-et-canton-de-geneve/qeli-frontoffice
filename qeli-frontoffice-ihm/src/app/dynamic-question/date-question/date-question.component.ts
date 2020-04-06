import { AfterViewInit, ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { QuestionComponent } from '../model/question.component';
import { DATE_CONTROL_TYPE, DateAnswer, DateQuestion } from './date-question.model';
import { FormGroup } from '@angular/forms';
import { RegisterQuestionComponent } from '../model/question-registry.model';
import { DateInputComponent } from '../../ge-forms/date-input/date-input.component';
import { QuestionOption } from '../model/quesiton.model';

@RegisterQuestionComponent(DATE_CONTROL_TYPE)
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

  onShortcutChanged(checked: boolean, shortcut: QuestionOption<string>) {
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
    return this.question.hasShortcuts && this.formGroup.value['shortcut'] !== 'NO_SHORTCUT';
  }

  get isDateValid() {
    return this.dateControl.pristine || this.dateControl.valid;
  }

  get dateErrors() {
    return !this.isDateValid ? Object.keys(this.dateControl.errors) : null;
  }
}
