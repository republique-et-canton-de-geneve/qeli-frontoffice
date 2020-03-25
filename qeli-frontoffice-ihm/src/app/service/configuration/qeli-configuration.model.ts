import { EtatCivil } from '../question/etat-civil/etat-civil.model';

export class QeliConfiguration {
  minYearsFromNow: number;
  maxEnfantsACharge: number;
  minTauxActiviteSeul: number;
  minTauxActiviteAvecConjoint: number;
  limiteFortune: number;
  limiteFortunePerEnfant: number;
  limiteFortuneConjoint: number;
  maxLimiteFortune: number;
  taxationAfcYearsFromNow: number;

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
  }
}

function getOrDefault<T>(actual: T, defaultValue: T) {
  return actual === null || actual === undefined ? defaultValue : actual;
}

export interface Demandeur {
  prenom: string;
  etatCivil: EtatCivil;
  dateNaissance: string;
  membresFamille: MembreFamille[];
}

export enum Relation {
  EPOUX                 = 'EPOUX',
  PARTENAIRE_ENREGISTRE = 'PARTENAIRE_ENREGISTRE',
  CONCUBIN              = 'CONCUBIN',
  ENFANT                = 'ENFANT'
}

export interface MembreFamille {
  prenom: string;
  relation: Relation;
  dateNaissance: Date;
}
