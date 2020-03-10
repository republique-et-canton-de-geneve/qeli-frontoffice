import { Prestation, PRESTATIONS_AVS_AI } from './prestation.model';
import { Refus } from './form-state.model';
import { Injectable } from '@angular/core';

const EXCLUDED_PRESTATIONS = [Prestation.SUBVENTION_HM];

@Injectable({
  providedIn: 'root'
})
export class PrestationResolver {

  private static hasAnyPCAVSAI(prestations: Prestation[]) {
    return prestations.some(prestation => PRESTATIONS_AVS_AI.includes(prestation));
  }

  private static groupPCAVSAI(prestations: Prestation[]) {
    let result = prestations.filter(prestation => !PRESTATIONS_AVS_AI.includes(prestation));
    result.push(Prestation.PC_AVS_AI);
    return result;
  }

  /**
   * Retourne la liste des prestations éligibles, depuis les prestations refusées
   *
   * @param prestationsRefusees les prestations refusées.
   * @param groupPCAVSAI
   */
  static findPrestationsEligibles(prestationsRefusees: Refus[], groupPCAVSAI = true): Prestation[] {
    const prestationsEligibles = Object.values(Prestation)
                                       .filter(prestation => !EXCLUDED_PRESTATIONS.includes(prestation))
                                       .filter(prestation => !prestationsRefusees.some(
                                         prestationRefusee => prestationRefusee.prestation === prestation
                                       ));

    return groupPCAVSAI && this.hasAnyPCAVSAI(prestationsEligibles) ?
           this.groupPCAVSAI(prestationsEligibles) : prestationsEligibles;
  }

  private static isPCAVSAIRefusee(refusees: Refus[]) {
    return PRESTATIONS_AVS_AI.every(prestation => refusees.some(refus => refus.prestation === prestation));
  }

  private static removePCAVSAIRefus(refusees: Refus[]) {
    return refusees.filter(refusee => !PRESTATIONS_AVS_AI.includes(refusee.prestation));
  }

  private static groupPCAVSAIRefus(refusees: Refus[]) {
    let result = this.removePCAVSAIRefus(refusees);
    const questionKeys = refusees.filter(refusee => PRESTATIONS_AVS_AI.includes(refusee.prestation))
                                 .map(refusee => refusee.questionKeys)
                                 .reduce((c, r) => r.concat(c), []);

    result.push(new Refus(Prestation.PC_AVS_AI, questionKeys));
    return result;
  }

  /**
   * Retourne la liste des Refus de Prestations (non éligibles), depuis les prestations refusées
   *
   * @param prestationsRefusees les prestations refusées.
   * @param data {} les réponses données dans le formulaire.
   */
  static findPrestationsRefusees(prestationsRefusees: Refus[], data: any): Refus[] {
    const prestationDejaPrecues = this.findPrestationsDejaPercues(data);
    const result = prestationsRefusees.filter(
      prestationRefusee => !prestationDejaPrecues.includes(prestationRefusee.prestation) &&
                           !EXCLUDED_PRESTATIONS.includes(prestationRefusee.prestation)
    );

    return this.isPCAVSAIRefusee(result) ? this.groupPCAVSAIRefus(result) : this.removePCAVSAIRefus(result);
  }

  /**
   * Retourne la liste des Refus de Prestations (non éligibles car déjà perçues), depuis les prestations refusées
   *
   * @param data {} les réponses données dans le formulaire.
   */
  static findPrestationsDejaPercues(data: any): Prestation[] {
    return data['prestations']['choices'];
  }

}
