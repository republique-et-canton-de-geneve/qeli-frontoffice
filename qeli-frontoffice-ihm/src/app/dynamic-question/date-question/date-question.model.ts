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
import { AbstractControl, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { DateValidators } from '../../ge-forms/date.validators';
import { Answer } from '../model/answer.model';
import { AnswerVisitor } from '../model/answer-visitor.model';
import { Question, QuestionOption, QuestionSchema } from '../model/question.model';

export const DATE_CONTROL_TYPE = 'date';

export interface DateAnswerSchema {
  shortcut?: QuestionOption<'NO_SHORTCUT' | string>;
  value: Date;
}

export class DateAnswer extends Answer {
  type = DATE_CONTROL_TYPE;
  shortcut?: QuestionOption<'NO_SHORTCUT' | string>;
  value: Date;

  constructor(options: DateAnswerSchema) {
    super();
    this.shortcut = options.shortcut;
    this.value = options.value;
  }

  accept<E>(visitor: AnswerVisitor<E>): E {
    return visitor.visitDateAnswer(this);
  }
}

export interface DateQuestionSchema extends QuestionSchema {
  shortcuts?: QuestionOption<'NO_SHORTCUT' | string>[];
  maxDate?: Date;
  minDate?: Date;
}

export class MissingNoShortcutOption extends Error {
  constructor(message?: string) {
    super(message);
  }
}

export class DateQuestion extends Question<DateAnswer> {
  controlType = DATE_CONTROL_TYPE;
  maxDate: Date;
  minDate: Date;
  shortcuts: QuestionOption<'NO_SHORTCUT' | string>[];

  constructor(options: DateQuestionSchema) {
    super(options);

    if (options.shortcuts.length > 0 &&
        options.shortcuts.filter(shortcut => shortcut.value === 'NO_SHORTCUT').length !== 1) {
      throw new MissingNoShortcutOption(
        "Une option et seulement une option de raccourci avec la valeur 'NO_SHORTCUT' " +
        "est obligatoire lors de l'utilisation de cette fonctionnalité.");
    }

    this.shortcuts = options.shortcuts ? options.shortcuts : [];
    this.minDate = options.minDate ? options.minDate : null;
    this.maxDate = options.maxDate ? options.maxDate : null;
  }

  protected requiredValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      if (control && control.value) {
        const isDateFilled = !!control.value['value'];
        const isShortcutSelected = this.shortcuts.length > 0 &&
                                   control.value['shortcut'] &&
                                   control.value['shortcut'] !== 'NO_SHORTCUT';

        return !isDateFilled && !isShortcutSelected ? {'required': true} : null;
      }

      return null;
    };
  }

  toFormControl(defaultValue: DateAnswer): AbstractControl {
    let group: any = {};

    if (this.shortcuts && this.shortcuts.length > 0) {
      group['shortcut'] = new FormControl(
        defaultValue && defaultValue.shortcut ? defaultValue.shortcut.value : 'NO_SHORTCUT'
      );
    }

    let dateValidators: ValidatorFn[] = [];

    if (this.maxDate) {
      dateValidators.push(DateValidators.maxDate(this.maxDate));
    }

    if (this.minDate) {
      dateValidators.push(DateValidators.minDate(this.minDate));
    }

    dateValidators.push(DateValidators.date);

    group['value'] = new FormControl(
      defaultValue && defaultValue.value ? defaultValue.value : null,
      dateValidators
    );

    return new FormGroup(group, this.validators);
  }

  accept<E>(visitor: QuestionVisitorModel<E>): E {
    return visitor.visitDateQuestion(this);
  }

  findShortcutByValue(value: 'NO_SHORTCUT' | string) {
    return this.shortcuts.find(option => option.value === value);
  }

  get hasShortcuts() {
    return this.shortcuts.length > 0;
  }

  get noShortcutOption() {
    return this.findShortcutByValue('NO_SHORTCUT');
  }

  get shortcutOptions() {
    return this.shortcuts.filter(shortcut => shortcut.value !== 'NO_SHORTCUT');
  }
}
