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

import { QuestionVisitorModel } from '../model/question-visitor.model';
import { AbstractControl, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { Question, QuestionSchema } from '../model/question.model';
import { NumberAnswer } from '../model/answer.model';

export const NUMBER_GROUP_TYPE = 'number';

export interface NumberQuestionSchema extends QuestionSchema {
  placeholder?: number;
  min?: number;
  max?: number;
  showDecimals?: boolean;
}

export class NumberQuestion extends Question<NumberAnswer> {
  controlType = NUMBER_GROUP_TYPE;
  placeholder: number;
  min: number;
  max: number;
  showDecimals: boolean;

  constructor(options: NumberQuestionSchema) {
    super(options);
    this.min = options.min;
    this.max = options.max;
    this.showDecimals = !!options.showDecimals;
    this.placeholder = options.placeholder;
  }

  toFormControl(defaultValue: NumberAnswer): AbstractControl {
    let numberValidators: ValidatorFn[] = [];

    if (this.showDecimals) {
      numberValidators.push(Validators.pattern(/-?\d+(,\d+)?/));
    } else {
      numberValidators.push(Validators.pattern(/-?\d+/));
    }

    if (this.max !== null && this.max !== undefined) {
      numberValidators.push(Validators.max(this.max));
    }

    if (this.min !== null && this.min !== undefined) {
      numberValidators.push(Validators.min(this.min));
    }

    return new FormControl(defaultValue ? defaultValue.value : null, this.validators.concat(numberValidators));
  }

  accept<E>(visitor: QuestionVisitorModel<E>): E {
    return visitor.visitNumberQuestion(this);
  }
}
