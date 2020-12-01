import { Result, ResultsByPrestation, TypeEligibilite } from './result.model';
import { Prestation } from '../configuration/prestation.model';
import { Demandeur } from '../configuration/demandeur.model';

export class EvaluatorUtils {
  public static isPrestationRefusee(type: TypeEligibilite) {
    return type === 'refusee'
  }

  public static isPrestationDejaPercue(type: TypeEligibilite) {
    return type === 'dejaPercue';
  }

  public static isPrestationEligible(type: TypeEligibilite) {
    return type === 'eligible';
  }

  public static isPrestationIndividuel(results: ResultsByPrestation) {
    return results.prestation === Prestation.SUBSIDES ||
           results.prestation === Prestation.BOURSES;
  }

  public static hasConcubin(results: ResultsByPrestation): boolean {
    const demandeur: Demandeur = this.getResultsDemandeur(results).membre as Demandeur;

    return demandeur.hasConcubin;
  }

  public static hasConcubinAvecEnfantsPropres(results: ResultsByPrestation): boolean {
    return this.hasConcubin && !!this.getResultsDemandeur(results).conjointEnfantsPropres;
  }

  public static getResultsDemandeur(results: ResultsByPrestation): Result {
    return results.results.find(r => r.membre.id === 0);
  }

  public static getEnfants11P(results: ResultsByPrestation) {
    return (this.getResultsDemandeur(results).enfants11P || []).map(enfant => enfant.prenom);
  }
}
