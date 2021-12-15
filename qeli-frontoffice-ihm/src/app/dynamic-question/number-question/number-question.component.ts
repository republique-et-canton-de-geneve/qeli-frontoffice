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
import { NUMBER_GROUP_TYPE, NumberQuestion } from './number-question.model';
import { FormGroup } from '@angular/forms';
import { RegisterQuestionComponent } from '../model/question-registry.model';
import { NumberAnswer } from '../model/answer.model';

@RegisterQuestionComponent(NUMBER_GROUP_TYPE)
@Component({
  selector: 'app-text-question',
  templateUrl: './number-question.component.html',
  styleUrls: ['./number-question.component.scss']
})
export class NumberQuestionComponent implements QuestionComponent<NumberAnswer> {
  @Input() question: NumberQuestion;
  @Input() form: FormGroup;
  @Input() disableFocusOnInit: boolean;

  get isValid() {
    return this.form.controls[this.question.key].pristine ||
           this.form.controls[this.question.key].valid;
  }
}

