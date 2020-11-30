import { Prestation } from '../../../service/configuration/prestation.model';
import { Personne } from '../../../service/configuration/demandeur.model';
import { I18nString } from '../../../core/i18n/i18nstring.model';

/**
 * Un objet qui permet de mettre en relation une prestation avec plusieurs résultats (normalement, un pour chaque
 * membre de la famille du demandeur, et un pour le demandeur).
 */
export interface ResultsByPrestation {
  /**
   * La prestation concernée.
   */
  prestation: Prestation;
  /**
   * La liste de résultats.
   */
  results: Result[];
}

/**
 * Un model représentant le résultat d'une éligibilité.
 */
export interface Result {
  /**
   * La personne.
   */
  membre: Personne;
  /**
   * Si true la personne est éligible.
   */
  eligible: boolean;
  /**
   * Si true la personne reçoit déjà la prestation.
   */
  dejaPercue?: boolean;
  /**
   * Le motif de refus.
   */
  motifRefus?: I18nString;
  /**
   * Si le conjoint a des enfants propres, true; false, sinon.
   * Calculé uniquement pour le demandeur.
   */
  conjointEnfantsPropres?: boolean;

  /**
   * Les enfants scolarisés en 11P.
   * Calculé uniquement en cas de refus des BOURSES.
   */
  enfants11P?: Personne[];
}

/**
 * Map contenant comme:
 *   - clé, le type de prestation
 *   - valeur, une fonction retournant la clé du message à afficher dans le bloc de résultats de la prestation.
 *       Cette valeur peut être un chaîne, qui sera utilisée comme clé de traduction;
 *       ou un I18nString si l'élément à traduire nécessite des paramètres.
 */
export interface MessageEvaluatorByPrestation {
  [key: string]: () => string | I18nString;
}

export function resultsComparator(a: Result, b: Result) {
  if (!a.eligible && !b.eligible) {
    if (a.dejaPercue && !b.dejaPercue) {
      return 1;
    } else if (!a.dejaPercue && b.dejaPercue) {
      return -1;
    } else {
      return 0;
    }
  } else {
    if (a.eligible && b.eligible) {
      return 0;
    } else if (a.eligible && !b.eligible) {
      return 1;
    } else if (!a.eligible && b.eligible) {
      return -1
    }
  }
}
