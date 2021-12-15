/*
 * qeli-frontoffice
 *
 * Copyright (C) 2019-2021 Republique et canton de Geneve
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Component, Input, ViewChild } from '@angular/core';
import { QuestionComponent } from '../model/question.component';
import { DATE_CONTROL_TYPE, DateAnswer, DateQuestion } from './date-question.model';
import { FormGroup } from '@angular/forms';
import { RegisterQuestionComponent } from '../model/question-registry.model';
import { DateInputComponent } from '../../ge-forms/date-input/date-input.component';
import { QuestionOption } from '../model/question.model';

@RegisterQuestionComponent(DATE_CONTROL_TYPE)
@Component({
  selector: 'app-date-question',
  templateUrl: './date-question.component.html',
  styleUrls: ['./date-question.component.scss']
})
export class DateQuestionComponent implements QuestionComponent<DateAnswer> {
  @ViewChild('dateInputComponent', {static: true}) dateInputComponent: DateInputComponent;

  @Input() question: DateQuestion;
  @Input() form: FormGroup;
  @Input() disableFocusOnInit: boolean;

  onShortcutChanged(checked: boolean, shortcut: QuestionOption<string>) {
    if (checked && shortcut !== null) {
      this.dateControl.setValue(null);
    }

    this.dateControl.markAsPristine();
  }

  get formGroup() {
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

  get isValid() {
    return this.form.controls[this.question.key].pristine ||
           this.form.controls[this.question.key].valid;
  }
}
