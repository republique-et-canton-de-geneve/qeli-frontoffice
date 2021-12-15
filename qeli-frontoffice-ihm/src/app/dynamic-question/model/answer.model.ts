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

import { AnswerVisitor } from './answer-visitor.model';
import { QuestionOption } from './question.model';

/**
 * Un modèle représentant la réponse de l'utilistateur à une question.
 */
export abstract class Answer {
  type: string;

  /**
   * Accepte le visiteur donné et exécute la fonction de visite pour ce type de réponse.
   *
   * @param visitor le visiteur.
   */
  abstract accept<E>(visitor: AnswerVisitor<E>): E;
}

/**
 * Le schema d'une réponse simple.
 */
export interface SimpleAnswerSchema<T> {
  /**
   * La valeur ce cette réponse.
   */
  value: T;
}

/**
 * Une réponse simple qui contient du texte.
 */
export class StringAnswer extends Answer {
  type = "string";
  value: string;

  constructor(options: SimpleAnswerSchema<string>) {
    super();
    this.value = options.value;
  }

  accept<E>(visitor: AnswerVisitor<E>): E {
    return visitor.visitStringAnswer(this);
  }
}

/**
 * Une réponse simple qui contient un nombre.
 */
export class NumberAnswer extends Answer {
  type = "number";
  value: number;

  constructor(options: SimpleAnswerSchema<number>) {
    super();
    this.value = options.value;
  }

  accept<E>(visitor: AnswerVisitor<E>): E {
    return visitor.visitNumberAnswer(this);
  }
}

/**
 * Une réponse simple qui contient une option.
 */
export class OptionAnswer<T> extends Answer {
  type = "option";
  value: QuestionOption<T>;

  constructor(options: SimpleAnswerSchema<QuestionOption<T>>) {
    super();
    this.value = options.value;
  }

  accept<E>(visitor: AnswerVisitor<E>): E {
    return visitor.visitOptionAnswer(this);
  }
}
