import { Prestation } from './prestation.model';
import { Refus } from './form-state.model';

const PRESTATIONS_QUESTION_KEY = 'prestations';

export class PrestationResolver {

  /**
   * Retourne la liste des prestations éligibles, depuis les prestations refusées
   * @param prestationsRefusees
   */
  static findPrestationsEligibles(prestationsRefusees: Refus[]): Prestation[] {
    return Object.values(Prestation).filter(
      prestation => !prestationsRefusees.some(
        prestationRefusee => prestationRefusee.prestation === prestation
      )
    );
  }

  /**
   * Retourne la liste des Refus de Prestations (non éligibles), depuis les prestations refusées
   * @param prestationsRefusees
   */
  static findPrestationsRefusees(prestationsRefusees: Refus[]): Refus[] {
    return prestationsRefusees.filter(
      prestationRefusee => prestationRefusee.questionKey !== PRESTATIONS_QUESTION_KEY
    );
  }

  /**
   * Retourne la liste des Refus de Prestations (non éligibles car déjà perçues), depuis les prestations refusées
   * @param prestationsRefusees
   */
  static findPrestationsDejaPercues(prestationsRefusees: Refus[]): Refus[] {
    return prestationsRefusees.filter(
      prestationRefusee => prestationRefusee.questionKey === PRESTATIONS_QUESTION_KEY
    )
  }

}
