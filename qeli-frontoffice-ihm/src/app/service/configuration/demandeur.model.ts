import { Prestation } from './prestation.model';
import { Eligibilite } from '../question/eligibilite.model';

/**
 * Un enum représentant les liens possibles entre le demandeur et un membre de la famille.
 */
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
  id: number;
  prenom: string;
  etatCivil: EtatCivil;
  dateNaissance: Date;
  membresFamille?: MembreFamille[];
}

export class Demandeur {
  id: number;
  prenom: string;
  etatCivil: EtatCivil;
  dateNaissance: Date;
  membresFamille: MembreFamille[];

  constructor(options: DemandeurSchema) {
    this.id = options.id;
    this.prenom = options.prenom;
    this.etatCivil = options.etatCivil;
    this.dateNaissance = options.dateNaissance;
    this.membresFamille = options.membresFamille || [];
  }

  toEligibilite(): Eligibilite[] {
    const eligibilites: Eligibilite[] = [];

    Object.values(Prestation)
          .filter(prestation => prestation !== Prestation.SUBVENTION_HM)
          .forEach(prestation => eligibilites.push({
            prestation: prestation,
            membre: this
          }));

    this.membresFamille.forEach(membre =>
      getElibiliteByMembre(membre.relation).forEach(prestation => {
        eligibilites.push({
          prestation: prestation,
          membre: membre
        })
      })
    );

    return eligibilites;
  }
}

export interface MembreFamille {
  id: number;
  prenom: string;
  relation: Relation;
  dateNaissance: Date;
}

function getElibiliteByMembre(relation: Relation) {
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
