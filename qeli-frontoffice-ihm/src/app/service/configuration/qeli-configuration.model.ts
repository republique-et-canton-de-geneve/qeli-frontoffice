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

/**
 * Un modèle représentant la configuration de l'application frontend du formulaire.
 */
export class QeliConfiguration {
  /**
   * Le nombre d'années maximales dans le passé saisissable dans un champ de type date.
   */
  minYearsFromNow: number;

  /**
   * Le nombre d'enfants maximales saisissables dans le formulaire.
   */
  maxEnfantsACharge: number;

  /**
   * Le taux minimal d'activité pour une personne seule pour recevoir des prestations complémentaires familiales.
   */
  minTauxActiviteSeul: number;

  /**
   * Le taux minimal d'activité pour personne seule et son conjoint/concubin pour recevoir des prestations
   * complémentaires familiales.
   */
  minTauxActiviteAvecConjoint: number;

  /**
   * La limite de fortune pour être éligible à l'aide sociale pour une personne seule.
   */
  limiteFortune: number;

  /**
   * La limite de fortune pour être éligible à l'aide sociale pour un enfant à charge.
   */
  limiteFortunePerEnfant: number;

  /**
   * La limite de fortune pour être éligible à l'aide sociale pour le conjoint.
   */
  limiteFortuneConjoint: number;

  /**
   * Le nombre d'enfants maximales saisissables dans le formulaire.
   */
  maxLimiteFortune: number;

  /**
   * Le nombre d'années écoulées depuis la dernière taxation AFC pertinente.
   */
  taxationAfcYearsFromNow: number;

  /**
   * Le nombre d'heure de travail par semaine (consideré comme 100% pour les taux d'activité).
   */
  heureTravailParSemaine: number;

  /**
   * Configuration Matomo.
   */
  matomo: { server: string, siteId: number, enabled: boolean };

  cookieBannerEnabled: boolean;

  api: { pdf: RestConfiguration, stats: RestConfiguration };

  deepLinkEnabled: boolean;

  constructor(options: any = {}) {
    this.minYearsFromNow = getOrDefault(options.minYearsFromNow, 130);
    this.maxEnfantsACharge = getOrDefault(options.maxEnfantsACharge, 20);
    this.minTauxActiviteSeul = getOrDefault(options.minTauxActiviteSeul, 40);
    this.minTauxActiviteAvecConjoint = getOrDefault(options.minTauxActiviteAvecConjoint, 90);
    this.limiteFortune = getOrDefault(options.limiteFortune, 4000);
    this.limiteFortunePerEnfant = getOrDefault(options.limiteFortunePerEnfant, 2000);
    this.limiteFortuneConjoint = getOrDefault(options.limiteFortuneConjoint, 4000);
    this.maxLimiteFortune = getOrDefault(options.maxLimiteFortune, 10000);
    this.taxationAfcYearsFromNow = getOrDefault(options.taxationAfcYearsFromNow, 2);
    this.heureTravailParSemaine = getOrDefault(options.heureTravailParSemaine, 40);
    this.matomo = getOrDefault(options.matomo);
    this.cookieBannerEnabled = getOrDefault(options.cookieBannerEnabled, false);
    this.api = getOrDefault(options.api, {pdf: {enabled: true}, stats: {enabled: true}});
    this.deepLinkEnabled = getOrDefault(options.deepLinkEnabled, true);
  }
}

export interface RestConfiguration {
  enabled: boolean;
}

function getOrDefault<T>(actual: T, defaultValue: T = null) {
  return actual === null || actual === undefined ? defaultValue : actual;
}
