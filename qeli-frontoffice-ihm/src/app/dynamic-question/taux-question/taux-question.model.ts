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
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Question, QuestionSchema } from '../model/question.model';
import { Answer } from '../model/answer.model';
import { AnswerVisitor } from '../model/answer-visitor.model';

export const TAUX_CONTROL_TYPE = 'taux';

export interface TauxAnswerSchema {
  value: number;
  isHourly?: boolean;
  workingHoursByWeek: number;
}

export class TauxAnswer extends Answer {
  type = TAUX_CONTROL_TYPE;
  value: number;
  isHourly: boolean;
  workingHoursByWeek: number;

  constructor(options: TauxAnswerSchema) {
    super();
    this.value = options.value;
    this.isHourly = !!options.isHourly;
    this.workingHoursByWeek = options.workingHoursByWeek;
  }

  accept<E>(visitor: AnswerVisitor<E>): E {
    return visitor.visitTauxAnswer(this);
  }
}

export interface TauxQuestionSchema extends QuestionSchema {
  workingHoursByWeek: number;
}

export class TauxQuestion extends Question<TauxAnswer> {
  controlType = TAUX_CONTROL_TYPE;
  workingHoursByWeek: number;

  constructor(options: TauxQuestionSchema) {
    super(options);
    this.workingHoursByWeek = options.workingHoursByWeek &&
                              options.workingHoursByWeek !== 0 ? options.workingHoursByWeek : 40;
  }

  protected requiredValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      if (control && control.value) {
        return control.value['value'] === null ||
               control.value['value'] === undefined ? {'required': true} : null;
      }

      return null;
    };
  }

  accept<E>(visitor: QuestionVisitorModel<E>): E {
    return visitor.visitTauxQuestion(this);
  }

  toFormControl(defaultValue: TauxAnswer): AbstractControl {
    let group: any = {};

    group['value'] = new FormControl(
      defaultValue ? defaultValue.value : null,
      [Validators.max(100), Validators.min(0), Validators.pattern(/-?\d+(,\d+)?/)]
    );
    group['isHourly'] = new FormControl(defaultValue ? defaultValue.isHourly : false);

    return new FormGroup(group, this.validators);
  }
}
