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
   * Configuration Matomo.
   */
  matomo: { server: string, siteId: number };

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
    this.matomo = getOrDefault(options.matomo);
  }
}

function getOrDefault<T>(actual: T, defaultValue: T = null) {
  return actual === null || actual === undefined ? defaultValue : actual;
}
