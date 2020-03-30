import { QeliConfiguration } from '../configuration/qeli-configuration.model';
import { Demandeur } from '../configuration/demandeur.model';
import { QeliQuestionDecorator } from './qeli-question-decorator.model';

/**
 * Une interface qui définit l'API pour un service de chargement de questions.
 */
export interface QuestionLoader {
  /**
   * Charge un ensemble de questions avec la configuration donnée.
   *
   * @param configuration un objet contenant tous les paramètres qui concernent la configuration des questions.
   * @param demandeur le demandeur et sa situation familiale.
   */
  loadQuestions(configuration: QeliConfiguration, demandeur: Demandeur): QeliQuestionDecorator<any>[];
}
