import { Prestation } from './prestation.model';
import { Eligibilite } from '../question/eligibilite.model';

export enum Relation {
  EPOUX                 = 'EPOUX',
  PARTENAIRE_ENREGISTRE = 'PARTENAIRE_ENREGISTRE',
  CONCUBIN              = 'CONCUBIN',
  ENFANT                = 'ENFANT'
}

export enum EtatCivil {
  CELIBATAIRE            = 'CELIBATAIRE',
  MARIE                  = 'MARIE',
  DIVORCE                = 'DIVORCE',
  SEPARE                 = 'SEPARE',
  PARTENARIAT_ENREGISTRE = 'PARTENARIAT_ENREGISTRE',
  VEUF                   = 'VEUF'
}

export interface DemandeurSchema {
  prenom: string;
  etatCivil: EtatCivil;
  dateNaissance: Date;
  membresFamille?: MembreFamille[];
}

export class Demandeur {
  prenom: string;
  etatCivil: EtatCivil;
  dateNaissance: Date;
  membresFamille: MembreFamille[];

  constructor(options: DemandeurSchema) {
    this.prenom = options.prenom;
    this.etatCivil = options.etatCivil;
    this.dateNaissance = options.dateNaissance;
    this.membresFamille = options.membresFamille || [];
  }

  toEligibilite(): Eligibilite[] {
    return Object.values(Prestation).map(prestation => ({
      prestation: prestation,
      membre: this
    }));
  }
}

export interface MembreFamille {
  prenom: string;
  relation: Relation;
  dateNaissance: Date;
}


export function getElibiliteByMembre(relation: Relation) {
  const prestations = [Prestation.SUBSIDES, Prestation.BOURSES];

  if (relation === Relation.EPOUX ||
      relation === Relation.PARTENAIRE_ENREGISTRE ||
      relation === Relation.ENFANT) {
    prestations.push(Prestation.PC_AVS_AI);
    prestations.push(Prestation.PC_FAM);
  } else if (relation === Relation.CONCUBIN) {
    prestations.push(Prestation.PC_FAM);
  }

  return prestations;
}
