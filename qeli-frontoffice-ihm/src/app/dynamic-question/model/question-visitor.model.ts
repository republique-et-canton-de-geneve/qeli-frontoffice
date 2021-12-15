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

import { CheckboxGroupQuestion } from '../checkbox-group-question/checkbox-group-question.model';
import { DateQuestion } from '../date-question/date-question.model';
import { DropdownQuestion } from '../dropdown-question/dropdown-question.model';
import { NationaliteQuestion } from '../nationalite-question/nationalite-question.model';
import { RadioQuestion } from '../radio-question/radio-question.model';
import { TextQuestion } from '../text-question/text-question.model';
import { NumberQuestion } from '../number-question/number-question.model';
import { TauxQuestion } from '../taux-question/taux-question.model';
import { CompositeQuestion } from '../composite-question/composite-question.model';

/**
 * L'interface visiteur déclare un ensemble de méthodes de visite qui correspondent aux classes des questions.
 * La signature d'une méthode de visite permet au visiteur d'identifier la classe exacte du composant qu'il traite.
 */
export interface QuestionVisitorModel<T> {
  /**
   * Une méthode pour visiter les question du type: {@link CheckboxGroupQuestion}.
   *
   * @param {CheckboxGroupQuestion} question la question à visiter
   *
   * @return le résultat du traitement de sla question.
   */
  visitCheckboxGroupQuestion(question: CheckboxGroupQuestion): T;

  /**
   * Une méthode pour visiter les question du type: {@link DateQuestion}.
   *
   * @param {DateQuestion} question la question à visiter
   *
   * @return le résultat du traitement de la question.
   */
  visitDateQuestion(question: DateQuestion): T;

  /**
   * Une méthode pour visiter les question du type: {@link DropdownQuestion}.
   *
   * @param {DropdownQuestion} question la question à visiter
   *
   * @return le résultat du traitement de la question.
   */
  visitDropdownQuestion(question: DropdownQuestion): T;

  /**
   * Une méthode pour visiter les question du type: {@link NationaliteQuestion}.
   *
   * @param {NationaliteQuestion} question la question à visiter
   *
   * @return le résultat du traitement de la question.
   */
  visitNationaliteQuestion(question: NationaliteQuestion): T;

  /**
   * Une méthode pour visiter les question du type: {@link NumberQuestion}.
   *
   * @param {NumberQuestion} question la question à visiter
   *
   * @return le résultat du traitement de la question.
   */
  visitNumberQuestion(question: NumberQuestion): T;

  /**
   * Une méthode pour visiter les question du type: {@link RadioQuestion}.
   *
   * @param {RadioQuestion} question la question à visiter
   *
   * @return le résultat du traitement de la question.
   */
  visitRadioQuestion(question: RadioQuestion): T;

  /**
   * Une méthode pour visiter les question du type: {@link TauxQuestion}.
   *
   * @param {TauxQuestion} question la question à visiter
   *
   * @return le résultat du traitement de la question.
   */
  visitTauxQuestion(question: TauxQuestion): T;

  /**
   * Une méthode pour visiter les question du type: {@link TextQuestion}.
   *
   * @param {TextQuestion} question la question à visiter
   *
   * @return le résultat du traitement de la question.
   */
  visitTextQuestion(question: TextQuestion): T;

  /**
   * Une méthode pour visiter les question du type: {@link CompositeQuestion}.
   *
   * @param {CompositeQuestion} question la question à visiter
   *
   * @return le résultat du traitement de la question.
   */
  visitCompositeQuestion(question: CompositeQuestion): T;
}

