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
import { NumberAnswer, OptionAnswer, StringAnswer } from './answer.model';
import { NationaliteAnswer } from '../nationalite-question/nationalite-question.model';
import { CompositeAnswer } from '../composite-question/composite-question.model';
import { TauxAnswer } from '../taux-question/taux-question.model';
import { DropdownAnswer } from '../dropdown-question/dropdown-question.model';

/**
 * L'interface visiteur déclare un ensemble de méthodes de visite qui correspondent aux classes des réponses.
 * La signature d'une méthode de visite permet au visiteur d'identifier la classe exacte du composant qu'il traite.
 */
export interface AnswerVisitor<T> {
  /**
   * Une méthode pour visiter une réponse de type: {@link StringAnswer}.
   *
   * @param {StringAnswer} answer la réponse à visiter.
   *
   * @return le résultat du traitement de la question.
   */
  visitStringAnswer(answer: StringAnswer): T;

  /**
   * Une méthode pour visiter une réponse de type: {@link NumberAnswer}.
   *
   * @param {NumberAnswer} answer la réponse à visiter.
   *
   * @return le résultat du traitement de la question.
   */
  visitNumberAnswer(answer: NumberAnswer): T;

  /**
   * Une méthode pour visiter une réponse de type: {@link OptionAnswer}.
   *
   * @param {OptionAnswer} answer la réponse à visiter.
   *
   * @return le résultat du traitement de la question.
   */
  visitOptionAnswer<E>(answer: OptionAnswer<E>): T;

  /**
   * Une méthode pour visiter une réponse de type: {@link CheckboxGroupAnswer}.
   *
   * @param {CheckboxGroupAnswer} answer la réponse à visiter.
   *
   * @return le résultat du traitement de la question.
   */
  visitCheckboxGroupAnswer(answer: CheckboxGroupAnswer): T;

  /**
   * Une méthode pour visiter une réponse de type: {@link DateAnswer}.
   *
   * @param {DateAnswer} answer la réponse à visiter.
   *
   * @return le résultat du traitement de la question.
   */
  visitDateAnswer(answer: DateAnswer): T;

  /**
   * Une méthode pour visiter une réponse de type: {@link DropdownAnswer}.
   *
   * @param {DropdownAnswer} answer la réponse à visiter.
   *
   * @return le résultat du traitement de la question.
   */
  visitDropdownAnswer(answer: DropdownAnswer): T;

  /**
   * Une méthode pour visiter une réponse de type: {@link NationaliteAnswer}.
   *
   * @param {NationaliteAnswer} answer la réponse à visiter.
   *
   * @return le résultat du traitement de la question.
   */
  visitNationaliteAnswer(answer: NationaliteAnswer): T;

  /**
   * Une méthode pour visiter une réponse de type: {@link CompositeAnswer}.
   *
   * @param {NationaliteAnswer} answer la réponse à visiter.
   *
   * @return le résultat du traitement de la question.
   */
  visitCompositeAnswer(answer: CompositeAnswer): T;

  /**
   * Une méthode pour visiter une réponse de type: {@link TauxAnswer}.
   *
   * @param {TauxAnswer} answer la réponse à visiter.
   *
   * @return le résultat du traitement de la question.
   */
  visitTauxAnswer(answer: TauxAnswer): T;
}
