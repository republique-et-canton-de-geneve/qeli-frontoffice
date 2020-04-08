import { QeliConfiguration } from '../configuration/qeli-configuration.model';
import { QeliQuestionDecorator, RefusEligibiliteFn } from './qeli-question-decorator.model';
import { Eligibilite, EligibiliteGroup, EligibiliteRefusee } from './eligibilite.model';
import { Prestation } from '../configuration/prestation.model';
import { I18nString } from '../../core/i18n/i18nstring.model';
import { OptionAnswer } from '../../dynamic-question/model/answer.model';
import { FormData } from '../../dynamic-question/model/question.model';

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

export class QuestionUtils {
  /**
   * Crée une fonction de refus d'éligibilité pour une prestation et une question avec une réponse de type
   * {@link OptionAnswer}. Un refus est cré lorsque l'utilisateur choisit l'option en paramètre.
   *
   * @param questionKey la clé de la question répondue.
   * @param prestation la prestation à refusée.
   * @param answer l'option qui déclenche le refus.
   * @param motif le motif de refus.
   *
   * @return la fonction de refus d'éligibilité.
   */
  static rejectPrestationByOptionAnswerFn(questionKey: string,
                                          answer: any,
                                          prestation: Prestation,
                                          motif: I18nString): RefusEligibiliteFn {
    return this.rejectPrestationFn(
      formData => {
        const choosenOption = (formData[questionKey] as OptionAnswer<any>).value;
        return choosenOption.value === answer
      }, prestation, motif
    );
  }

  /**
   * Crée une fonction de refus d'éligibilité pou une prestation. Le refus est déclenché lorsque la condition donnée
   * est vraie.
   *
   * @param isRejected la condition de refus.
   * @param prestation la prestation à refusée.
   * @param motif le motif de refus.
   *
   * @return la fonction de refus d'éligibilité.
   */
  static rejectPrestationFn(isRejected: (formData: FormData) => boolean,
                            prestation: Prestation,
                            motif: I18nString): RefusEligibiliteFn {
    return (formData: FormData, eligibilites: Eligibilite[]) => {
      if (isRejected(formData)) {
        const eligibiliteGroup = new EligibiliteGroup(eligibilites);
        return eligibiliteGroup
          .findByPrestation(prestation)
          .map(eligibilite => ({eligibilite: eligibilite, motif: motif} as EligibiliteRefusee));
      } else {
        return [];
      }
    };
  }
}
