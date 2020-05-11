package ch.ge.social.qeli.service.api.answer;

import ch.ge.social.qeli.service.api.answer.dto.CheckboxGroupAnswer;
import ch.ge.social.qeli.service.api.answer.dto.CompositeAnswer;
import ch.ge.social.qeli.service.api.answer.dto.DateAnswer;
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
