import { QeliConfiguration } from '../configuration/qeli-configuration.model';
import { QeliQuestionDecorator } from './qeli-question-decorator.model';
import { Demandeur } from '../configuration/demandeur.model';

/**
 * Une interface qui définit l'API pour un service de chargement de questions.
 */
export abstract class QuestionLoader {
  demandeur: Demandeur;

  constructor(demandeur: Demandeur) {
    this.demandeur = demandeur;
  }

  /**
   * Charge un ensemble de questions avec la configuration donnée.
   *
   * @param configuration un objet contenant tous les paramètres qui concernent la configuration des questions.
   */
  abstract loadQuestions(configuration: QeliConfiguration): QeliQuestionDecorator<any>[];
}

