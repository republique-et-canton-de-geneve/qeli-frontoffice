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
import { RegisterQuestionComponent } from '../model/question-registry.model';
import { UntypedFormGroup } from '@angular/forms';
import { RADIO_CONTROL_TYPE, RadioQuestion } from './radio-question.model';
import { QuestionComponent } from '../model/question.component';
import { OptionAnswer } from '../model/answer.model';

@RegisterQuestionComponent(RADIO_CONTROL_TYPE)
@Component({
  selector: 'app-radio-question',
  templateUrl: './radio-question.component.html',
  styleUrls: ['./radio-question.component.scss']
})
export class RadioQuestionComponent implements QuestionComponent<OptionAnswer<string>> {
  @Input() question: RadioQuestion;
  @Input() form: UntypedFormGroup;
  @Input() disableFocusOnInit: boolean;

  get isValid() {
    return this.form.controls[this.question.key].pristine ||
           this.form.controls[this.question.key].valid;
  }
}
