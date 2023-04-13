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
import { TAUX_CONTROL_TYPE, TauxQuestion } from './taux-question.model';
import { UntypedFormGroup } from '@angular/forms';
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
  @Input() form: UntypedFormGroup;
  @Input() disableFocusOnInit: boolean;

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
    return this.form.controls[this.question.key] as UntypedFormGroup;
  }

  get isValid() {
    return this.form.controls[this.question.key].pristine ||
           this.form.controls[this.question.key].valid;
  }
}

