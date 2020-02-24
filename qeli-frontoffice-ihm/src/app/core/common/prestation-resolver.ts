import { Prestation } from './prestation.model';
import { Refus } from './form-state.model';

const EXCLUDED_PRESTATIONS = [Prestation.SUBVENTION_HM];

export class PrestationResolver {

  /**
   * Retourne la liste des prestations éligibles, depuis les prestations refusées
   *
   * @param prestationsRefusees les prestations refusées.
   */
  static findPrestationsEligibles(prestationsRefusees: Refus[]): Prestation[] {
    return Object.values(Prestation)
                 .filter(prestation => !EXCLUDED_PRESTATIONS.includes(prestation))
                 .filter(prestation => !prestationsRefusees.some(
                   prestationRefusee => prestationRefusee.prestation === prestation
                 ));
  }

  /**
   * Retourne la liste des Refus de Prestations (non éligibles), depuis les prestations refusées
   *
   * @param prestationsRefusees les prestations refusées.
   * @param data {} les réponses données dans le formulaire.
   */
  static findPrestationsRefusees(prestationsRefusees: Refus[], data: any): Refus[] {
    const prestationDejaPrecues = PrestationResolver.findPrestationsDejaPercues(data);
    return prestationsRefusees.filter(
      prestationRefusee => !prestationDejaPrecues.includes(prestationRefusee.prestation)
    );
  }

  /**
   * Retourne la liste des Refus de Prestations (non éligibles car déjà perçues), depuis les prestations refusées
   *
   * @param data {} les réponses données dans le formulaire.
   */
  static findPrestationsDejaPercues(data: any): Prestation[] {
    return data['prestations']['choices'].filter(prestation => !EXCLUDED_PRESTATIONS.includes(prestation));
  }

}
