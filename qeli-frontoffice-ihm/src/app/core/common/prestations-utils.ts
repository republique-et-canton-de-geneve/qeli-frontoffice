import { Prestation } from './prestation.model';
import { Refus } from '../dynamic-form/form-state.model';

export const PRESTATIONS = 'prestations';

export default class PrestationsUtils {

  /**
   * Retourne la liste des Prestations éligibles, depuis les prestations refusées
   * @param prestationsRefusees
   */
  static getPrestationsEligibles(prestationsRefusees: Refus[]): Prestation[] {
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
  static getPrestationsRefusees(prestationsRefusees: Refus[]): Refus[] {
    return prestationsRefusees.filter(
      prestationRefusee => prestationRefusee.questionKey !== PRESTATIONS
    );
  }

  /**
   * Retourne la liste des Refus de Prestations (non éligibles car déjà perçues), depuis les prestations refusées
   * @param prestationsRefusees
   */
  static getPrestationsDejaPercues(prestationsRefusees: Refus[]): Refus[] {
    return prestationsRefusees.filter(
      prestationRefusee => prestationRefusee.questionKey === PRESTATIONS
    )
  }

}
