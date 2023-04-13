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

import { AbstractControl, UntypedFormArray, UntypedFormControl, UntypedFormGroup, ValidatorFn } from '@angular/forms';
import { Pays } from './pays.model';
import { QuestionVisitorModel } from '../model/question-visitor.model';
import { Question, QuestionOption, QuestionSchema } from '../model/question.model';
import { Answer } from '../model/answer.model';
import { AnswerVisitor } from '../model/answer-visitor.model';

export const NATIONALITE_CONTROL_TYPE = 'nationalite';

export interface NationaliteAnswerSchema {
  pays: QuestionOption<Pays>[];
  apatride: boolean;
}

export class NationaliteAnswer extends Answer {
  type = NATIONALITE_CONTROL_TYPE;
  pays: QuestionOption<Pays>[];
  apatride: boolean;

  constructor(options: NationaliteAnswerSchema) {
    super();
    this.pays = options.pays;
    this.apatride = options.apatride;
  }

  accept<E>(visitor: AnswerVisitor<E>): E {
    return visitor.visitNationaliteAnswer(this);
  }
}

export class NationaliteQuestion extends Question<NationaliteAnswer> {
  controlType = NATIONALITE_CONTROL_TYPE;
  paysOptions: QuestionOption<Pays>[];

  constructor(options: QuestionSchema) {
    super(options);

    this.paysOptions = Object.values(Pays).map(pays => ({
      value: pays,
      label: {key: `common.pays.${pays}`}
    }));
  }

  protected requiredValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      if (control.value['apatride'] !== true &&
          (!control.value['pays'] || (control.value['pays'] as string[]).every(e => !e))
      ) {
        return {'required': true}
      } else {
        return null;
      }
    };
  }

  toFormControl(defaultValue: NationaliteAnswer): AbstractControl {
    let group: any = {};

    group['apatride'] = new UntypedFormControl(defaultValue ? defaultValue.apatride : false);
    group['pays'] = new UntypedFormArray(
      defaultValue && defaultValue.pays && defaultValue.pays.length > 0 ?
      defaultValue.pays.map(pay => new UntypedFormControl(pay.value)) : [new UntypedFormControl()]
    );

    return new UntypedFormGroup(group, this.validators);
  }

  accept<E>(visitor: QuestionVisitorModel<E>): E {
    return visitor.visitNationaliteQuestion(this);
  }
}

