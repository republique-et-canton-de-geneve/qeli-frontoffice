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
import { QuestionSchema, StringQuestion } from '../model/question.model';
import { I18nString } from '../../core/i18n/i18nstring.model';

export const TEXT_CONTROL_TYPE = 'text';

export interface TextQuestionSchema extends QuestionSchema {
  placeholder?: I18nString;
  type?: string;
}

export class TextQuestion extends StringQuestion {
  controlType = TEXT_CONTROL_TYPE;
  placeholder: I18nString;
  type: string;

  constructor(options: TextQuestionSchema) {
    super(options);
    this.type = options.type || 'text';
    this.placeholder = options.placeholder || null;
  }

  accept<E>(visitor: QuestionVisitorModel<E>): E {
    return visitor.visitTextQuestion(this);
  }
}
