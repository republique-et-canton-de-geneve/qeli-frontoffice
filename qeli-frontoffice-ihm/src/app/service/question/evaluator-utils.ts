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
}
