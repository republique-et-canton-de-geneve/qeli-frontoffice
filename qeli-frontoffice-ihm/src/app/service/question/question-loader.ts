import { QeliConfiguration } from '../configuration/qeli-configuration.model';
import { QeliQuestionDecorator } from './qeli-question-decorator.model';
import { Eligibilite } from './eligibilite.model';

/**
 * Une interface qui définit l'API pour un service de chargement de questions.
 */
export interface QuestionLoader {
  /**
   * Charge un ensemble de questions avec la configuration donnée.
   *
   * @param configuration un objet contenant tous les paramètres qui concernent la configuration des questions.
   * @param eligibilites la liste d'éligibilités initiale.
   */
  loadQuestions(configuration: QeliConfiguration, eligibilites: Eligibilite[]): QeliQuestionDecorator<any>[];
}
