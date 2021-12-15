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

import { Component, Input } from '@angular/core';
import { QuestionComponent } from '../model/question.component';
import { DROPDOWN_CONTROL_TYPE, DropdownQuestion } from './dropdown-question.model';
import { FormGroup } from '@angular/forms';
import { RegisterQuestionComponent } from '../model/question-registry.model';
import { OptionAnswer } from '../model/answer.model';

@RegisterQuestionComponent(DROPDOWN_CONTROL_TYPE)
@Component({
  selector: 'app-dropdown-question',
  templateUrl: './dropdown-question.component.html',
  styleUrls: ['./dropdown-question.component.scss']
})
export class DropdownQuestionComponent implements QuestionComponent<OptionAnswer<string>> {
  @Input() question: DropdownQuestion;
  @Input() form: FormGroup;
  @Input() disableFocusOnInit: boolean;

  onMainOptionChanged() {
    if (this.isInconnuSelected) {
      this.dropdownControl.setValue(null);
    }

    this.formGroup.markAsPristine();
  }

  get formGroup() {
    return this.form.controls[this.question.key] as FormGroup;
  }

  get dropdownControl() {
    return this.formGroup.controls['value'];
  }

  get isValid() {
    return this.form.controls[this.question.key].pristine ||
           this.form.controls[this.question.key].valid;
  }

  get isInconnuSelected() {
    return this.formGroup.value['hasSome'] !== 'OUI';
  }
}
