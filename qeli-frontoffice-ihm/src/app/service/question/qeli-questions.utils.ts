import { Prestation } from '../configuration/prestation.model';
import { Personne } from '../configuration/demandeur.model';
import { Eligibilite, EligibiliteGroup, EligibiliteRefusee } from './eligibilite.model';
import { I18nString } from '../../core/i18n/i18nstring.model';
import { RefusEligibiliteFn } from './qeli-question-decorator.model';
import { OptionAnswer } from '../../dynamic-question/model/answer.model';
import { FormData } from '../../dynamic-question/model/question.model';

export class QuestionUtils {
  /**
   * Crée une fonction de refus d'éligibilité pour une ou plusieurs prestations et une question avec une réponse de type
   * {@link OptionAnswer}. Un refus est cré lorsque l'utilisateur choisit l'option en paramètre.
   *
   * @param questionKey la clé de la question répondue.
   * @param prestation la prestation ou les prestations à refuser.
   * @param answer l'option qui déclenche le refus.
   * @param eligibiliteToMotif une méthode qui génère un motif de refus pour une éligibilité.
   *
   * @return la fonction de refus d'éligibilité.
   */
  static rejectPrestationByOptionAnswerFn(questionKey: string,
                                          answer: any,
                                          prestation: Prestation | Prestation[],
                                          eligibiliteToMotif: (eligibilite: Eligibilite) => I18nString): RefusEligibiliteFn {
    return this.rejectPrestationFn(
      formData => {
        const choosenOption = (formData[questionKey] as OptionAnswer<any>).value;
        return choosenOption.value === answer
      }, prestation, eligibiliteToMotif
    );
  }

  /**
   * Crée une fonction de refus d'éligibilité pour une ou plusieurs prestations. Le refus est déclenché lorsque la
   * condition donnée est vraie.
   *
   * @param isRejected la condition de refus.
   * @param prestation la prestation ou les prestations à refuser.
   * @param eligibiliteToMotif une méthode qui génère un motif de refus pour une éligibilité.
   *
   * @return la fonction de refus d'éligibilité.
   */
  static rejectPrestationFn(isRejected: (formData: FormData) => boolean,
                            prestation: Prestation | Prestation[],
                            eligibiliteToMotif: (eligibilite: Eligibilite) => I18nString): RefusEligibiliteFn {
    return (formData: FormData, eligibilites: Eligibilite[]) => {
      if (isRejected(formData)) {
        return this.createRefusByPrestation(eligibilites, prestation, eligibiliteToMotif);
      } else {
        return [];
      }
    };
  }

  /**
   * Crée une liste de refus pour une ou plusieurs prestations.
   *
   * @param eligibilites les éligibilités encore possibles.
   * @param prestation la prestation ou les prestations à refuser.
   * @param eligibiliteToMotif une méthode qui génère un motif de refus pour une éligibilité.
   *
   * @return la liste des refus.
   */
  static createRefusByPrestation(eligibilites: Eligibilite[],
                                 prestation: Prestation | Prestation[],
                                 eligibiliteToMotif: (eligibilite: Eligibilite) => I18nString): EligibiliteRefusee[] {
    const eligibiliteGroup = new EligibiliteGroup(eligibilites);
    return eligibiliteGroup
      .findByPrestation(prestation)
      .map(eligibilite => ({eligibilite: eligibilite, motif: eligibiliteToMotif(eligibilite)} as EligibiliteRefusee));
  }

  /**
   * Crée une liste de refus pour une ou plusieurs prestations associées à un membre.
   *
   * @param eligibilites les éligibilités encore possibles.
   * @param prestation la prestation ou les prestations à refuser.
   * @param membre le membre associé aux prestations.
   * @param eligibiliteToMotif une méthode qui génère un motif de refus pour une éligibilité.
   *
   * @return la liste des refus.
   */
  static createRefusByPrestationAndMembre(eligibilites: Eligibilite[],
                                          prestation: Prestation | Prestation[],
                                          membre: Personne,
                                          eligibiliteToMotif: (eligibilite: Eligibilite) => I18nString): EligibiliteRefusee[] {
    const eligibiliteGroup = new EligibiliteGroup(eligibilites);
    return eligibiliteGroup
      .findByPrestationEtMembre(prestation, membre)
      .map(eligibilite => ({eligibilite: eligibilite, motif: eligibiliteToMotif(eligibilite)} as EligibiliteRefusee));
  }

  /**
   * Crée une liste de libellées d'erreurs pour une question à partir de sa clé et une liste de clés d'erreurs.
   *
   * @param questionKey la clé de la question.
   * @param errorKeys les clés d'erreurs.
   * @param translateParams les paramètres de traduction.
   *
   * @return la liste de libellées.
   */
  static toErrorLabels(questionKey: string,
                       errorKeys: string[],
                       translateParams?: { [key: string]: string | number | Date }) {
    return errorKeys.map(errorKey => {
      const entry: { [key: string]: I18nString } = {};
      entry[errorKey] = {key: `question.${questionKey}.error.${errorKey}`, parameters: translateParams};
      return entry;
    }).reduce((r, c) => Object.assign(r, c), {});
  }
}
