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
import { Question, QuestionSchema } from '../model/question.model';
import { Answer } from '../model/answer.model';
import { AbstractControl, UntypedFormGroup } from '@angular/forms';
import { AnswerVisitor } from '../model/answer-visitor.model';

export const COMPOSITE_CONTROL_TYPE = 'composite';

/**
 * Le schema d'une réponse à une question de type {@link CompositeQuestionSchema}.
 */
export interface CompositeAnswerSchema {
  answers: { [key: string]: Answer };
}

/**
 * La réponse à une question de type {@link CompositeQuestionSchema}.
 */
export class CompositeAnswer extends Answer {
  type = COMPOSITE_CONTROL_TYPE;
  /**
   * Les réponses à toutes les questions qui compose cette question multiple.
   */
  answers: { [key: string]: Answer };

  constructor(options: CompositeAnswerSchema) {
    super();
    this.answers = options.answers;
  }

  accept<E>(visitor: AnswerVisitor<E>): E {
    return visitor.visitCompositeAnswer(this);
  }
}

/**
 * Un modèle représentant une question qui fait partir d'une aggregation des questions.
 */
export interface CompositeItem {
  /**
   * La question.
   */
  question: Question<any>;
  /**
   * Une méthode pour déterminer si une question doit être montrée ou pas à partir des données déjà saisie dans le
   * formulaire. Quand une question n'est pas montrée elle est aussi désactivé, elle n'est pas valide et les données
   * saisies ne sont pas prise en compte dans la réponse.
   *
   * @param value les données saisies dans le formulaire.
   */
  isShown?: (value: any) => boolean;
}

/**
 * Le schema d'une question multiple.
 */
export interface CompositeQuestionSchema extends QuestionSchema {
  items: CompositeItem[];
}

/**
 * Une question multiple permettant d'aggregées plusieurs questions sur le même composant. Les questions peuvent
 * interagir entre elles de façon limité et leur réponses sont agrégés  dans le résultat.
 */
export class CompositeQuestion extends Question<CompositeAnswer> {
  controlType = COMPOSITE_CONTROL_TYPE;
  /**
   * Les questions qui composent cette question multiple.
   */
  items: CompositeItem[];

  constructor(options: CompositeQuestionSchema) {
    super(options);
    this.items = options.items;
  }

  accept<E>(visitor: QuestionVisitorModel<E>): E {
    return visitor.visitCompositeQuestion(this);
  }

  toFormControl(defaultValue?: CompositeAnswer): AbstractControl {
    let group: any = {};

    this.items.map(item => item.question).forEach(question => {
      group[question.key] = question.toFormControl(defaultValue ? defaultValue.answers[question.key] : null);

    });

    return new UntypedFormGroup(group, this.validators);
  }
}
