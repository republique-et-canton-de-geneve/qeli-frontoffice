/*
 * qeli-frontoffice
 *
 * Copyright (C) 2019-2021 Republique et canton de Geneve
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Prestation } from '../configuration/prestation.model';
import { Personne } from '../configuration/demandeur.model';
import { I18nString } from '../../core/i18n/i18nstring.model';
import { FormData } from '../../dynamic-question/model/question.model';

export interface FormResult {
  prestationsEligibles: ResultsByPrestation[];
  prestationsDejaPercues: ResultsByPrestation[];
  prestationsRefusees: ResultsByPrestation[];
}

export type TypeEligibilite = 'eligible' | 'refusee' | 'dejaPercue';

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
}

/**
 * Interface pour séparer la génération des messages informatifs par prestation.
 */
export interface MessageEvaluator {
  /**
   * Retourne la clé du message à afficher dans le bloc de résultats de la prestation.
   *       Cette valeur peut être un chaîne, qui sera utilisée comme clé de traduction;
   *       ou un I18nString si l'élément à traduire nécessite des paramètres.
   * @param type le type d'éligibilité
   * @param results le bloc contenant les résultats
   * @param formData les réponses du formulaire
   */
  evaluate(type: TypeEligibilite, results: ResultsByPrestation, formData: FormData): string | I18nString;
}

/**
 * Map contenant comme:
 *   - clé, le type de prestation
 *   - valeur, l'implémentation du générator des messages informatifs.
 */
export interface MessageEvaluatorByPrestation {
  [key: string]: MessageEvaluator;
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
