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

import { CheckboxGroupAnswer } from '../checkbox-group-question/checkbox-group-question.model';
import { DateAnswer } from '../date-question/date-question.model';
import { NationaliteAnswer } from '../nationalite-question/nationalite-question.model';
import { TranslateService } from '@ngx-translate/core';
import { QuestionOption } from './question.model';
import { AnswerVisitor } from './answer-visitor.model';
import { NumberAnswer, OptionAnswer, StringAnswer } from './answer.model';
import { CompositeAnswer } from '../composite-question/composite-question.model';
import * as moment from 'moment';
import { TauxAnswer } from '../taux-question/taux-question.model';
import { DropdownAnswer } from '../dropdown-question/dropdown-question.model';

export class FormatAnswerVisitor implements AnswerVisitor<string> {
  constructor(private translate: TranslateService) {
  }

  private translateOption<T>(option: QuestionOption<T>) {
    return this.translate.instant(option.label.key, option.label.parameters);
  }

  visitCheckboxGroupAnswer(answer: CheckboxGroupAnswer): string {
    if (!answer.hasSome || answer.hasSome.value === 'OUI') {
      return answer.choices.map(choice => this.translateOption(choice)).join(', ');
    } else {
      return this.translateOption(answer.hasSome);
    }
  }

  visitDateAnswer(answer: DateAnswer): string {
    if (answer.shortcut && answer.shortcut.value === 'NO_SHORTCUT') {
      return moment(answer.value).format('DD.MM.YYYY');
    } else {
      return this.translateOption(answer.shortcut);
    }
  }

  visitDropdownAnswer(answer: DropdownAnswer): string {
    if (answer.hasSome && answer.hasSome.value === 'OUI') {
      return this.translateOption(answer.value);
    } else {
      return this.translateOption(answer.hasSome);
    }
  }

  visitNationaliteAnswer(answer: NationaliteAnswer): string {
    if (!answer.apatride) {
      return answer.pays.map(option => this.translateOption(option)).join(', ');
    } else {
      return this.translate.instant('common.apatride.label');
    }
  }

  visitNumberAnswer(answer: NumberAnswer): string {
    return answer.value.toString();
  }

  visitStringAnswer(answer: StringAnswer): string {
    return answer.value;
  }

  visitOptionAnswer<E>(answer: OptionAnswer<E>): string {
    return this.translateOption(answer.value);
  }

  visitCompositeAnswer(answer: CompositeAnswer): string {
    return Object.values(answer.answers).map(answer => answer.accept(this)).join(', ');
  }

  visitTauxAnswer(answer: TauxAnswer): string {
    if (answer.isHourly) {
      return `${answer.value} ${this.translate.instant('common.taux.hourlySuffix')}`;
    }
    return `${answer.value}%`;
  }
}
