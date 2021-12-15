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

package ch.ge.social.qeli.service.api.answer;

import ch.ge.social.qeli.service.api.answer.dto.CheckboxGroupAnswer;
import ch.ge.social.qeli.service.api.answer.dto.CompositeAnswer;
import ch.ge.social.qeli.service.api.answer.dto.DateAnswer;
import ch.ge.social.qeli.service.api.answer.dto.DropdownAnswer;
import ch.ge.social.qeli.service.api.answer.dto.NationaliteAnswer;
import ch.ge.social.qeli.service.api.answer.dto.NumberAnswer;
import ch.ge.social.qeli.service.api.answer.dto.OptionAnswer;
import ch.ge.social.qeli.service.api.answer.dto.StringAnswer;
import ch.ge.social.qeli.service.api.answer.dto.TauxAnswer;

/**
 * L'interface visiteur déclare un ensemble de méthodes de visite qui correspondent aux classes des réponses. La
 * signature d'une méthode de visite permet au visiteur d'identifier la classe exacte du composant qu'il traite.
 */
public interface AnswerVisitor<T> {

  /**
   * Une méthode pour visiter une réponse de type: {@link CheckboxGroupAnswer}.
   *
   * @param answer la réponse à visiter.
   *
   * @return le résultat du traitement de la question.
   *
   * @throws InvalidAnswerFormatException Si la réponse n'est pas lisible.
   */
  T visitCheckboxGroupAnswer(CheckboxGroupAnswer answer);

  /**
   * Une méthode pour visiter une réponse de type: {@link DateAnswer}.
   *
   * @param answer la réponse à visiter.
   *
   * @return le résultat du traitement de la question.
   *
   * @throws InvalidAnswerFormatException Si la réponse n'est pas lisible.
   */
  T visitDateAnswer(DateAnswer answer);


  /**
   * Une méthode pour visiter une réponse de type: {@link DropdownAnswer}.
   *
   * @param answer la réponse à visiter.
   *
   * @return le résultat du traitement de la question.
   *
   * @throws InvalidAnswerFormatException Si la réponse n'est pas lisible.
   */
  T visitDropdownAnswer(DropdownAnswer answer);

  /**
   * Une méthode pour visiter une réponse de type: {@link OptionAnswer}.
   *
   * @param answer la réponse à visiter.
   *
   * @return le résultat du traitement de la question.
   *
   * @throws InvalidAnswerFormatException Si la réponse n'est pas lisible.
   */
  T visitOptionAnswer(OptionAnswer<?> answer);

  /**
   * Une méthode pour visiter une réponse de type: {@link NationaliteAnswer}.
   *
   * @param answer la réponse à visiter.
   *
   * @return le résultat du traitement de la question.
   *
   * @throws InvalidAnswerFormatException Si la réponse n'est pas lisible.
   */
  T visitNationaliteAnswer(NationaliteAnswer answer);

  /**
   * Une méthode pour visiter une réponse de type: {@link NumberAnswer}.
   *
   * @param answer la réponse à visiter.
   *
   * @return le résultat du traitement de la question.
   *
   * @throws InvalidAnswerFormatException Si la réponse n'est pas lisible.
   */
  T visitNumberAnswer(NumberAnswer answer);

  /**
   * Une méthode pour visiter une réponse de type: {@link TauxAnswer}.
   *
   * @param answer la réponse à visiter.
   *
   * @return le résultat du traitement de la question.
   *
   * @throws InvalidAnswerFormatException Si la réponse n'est pas lisible.
   */
  T visitTauxAnswer(TauxAnswer answer);

  /**
   * Une méthode pour visiter une réponse de type: {@link StringAnswer}.
   *
   * @param answer la réponse à visiter.
   *
   * @return le résultat du traitement de la question.
   *
   * @throws InvalidAnswerFormatException Si la réponse n'est pas lisible.
   */
  T visitTextAnswer(StringAnswer answer);

  /**
   * Une méthode pour visiter une réponse de type: {@link CompositeAnswer}.
   *
   * @param answer la réponse à visiter.
   *
   * @return le résultat du traitement de la question.
   *
   * @throws InvalidAnswerFormatException Si la réponse n'est pas lisible.
   */
  T visitCompositeAnswer(CompositeAnswer answer);
}
