import { CheckboxGroupAnswer } from '../checkbox-group-question/checkbox-group-question.model';
import { DateAnswer } from '../date-question/date-question.model';
import { NumberAnswer, OptionAnswer, StringAnswer } from './answer.model';
import { NationaliteAnswer } from '../nationalite-question/nationalite-question.model';
import { CompositeAnswer } from '../composite-question/composite-question.model';
import { TauxAnswer } from '../taux-question/taux-question.model';

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
