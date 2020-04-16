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

/**
 * Un enum représentant les états civils possibles du demandeur.
 */
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

/**
 * Un modèle représentant la personne qui fait une demande auprès du questionnaire d'éligibilité.
 */
export class Demandeur {
  /**
   * Un identifiant unique entre les membres du foyer, pour le demandeur cette valuer est toujours 0.
   */
  id: number;

  /**
   * Le prénom. Ce prénom apparaît sur l'écran pour identifier la personne.
   */
  prenom: string;

  /**
   * L'état civil du demandeur.
   */
  etatCivil: EtatCivil;

  /**
   * La data de naissance.
   */
  dateNaissance: Date;

  /**
   * Les membres qui composent le foyer du demandeur.
   */
  membresFamille: MembreFamille[];

  constructor(options: DemandeurSchema) {
    this.id = options.id;
    this.prenom = options.prenom;
    this.etatCivil = options.etatCivil;
    this.dateNaissance = options.dateNaissance;
    this.membresFamille = options.membresFamille || [];
  }

  /**
   * Crée une nouvelle matrice d'éligibilité pour ce Demandeur et les membres de son foyer.
   */
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

  /**
   * Tous les enfants de ce demandeur.
   */
  get enfants(): MembreFamille[] {
    return this.membresFamille.filter(membre => membre.relation === Relation.ENFANT);
  }

  /**
   * Le partenaire du demandeur (epoux, concubin ou partenaire enregistré).
   */
  get partenaire(): MembreFamille {
    return this.membresFamille.find(membre =>
      membre.relation === Relation.PARTENAIRE_ENREGISTRE ||
      membre.relation === Relation.EPOUX ||
      membre.relation === Relation.CONCUBIN
    );
  }

  /**
   * Si le demandeur est marié ou en partenariat entregistré.
   */
  get hasConjoint() {
    return this.etatCivil === EtatCivil.PARTENARIAT_ENREGISTRE ||
           this.etatCivil === EtatCivil.MARIE;
  }

  /**
   * Si le demandeur a un concubin.
   */
  get hasConcubin() {
    return this.membresFamille.some(membre => membre.relation === Relation.CONCUBIN);
  }
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

/**
 * Un modèle représentant un membre de la famille du demandeur habitant sous le même foyer.
 */
export interface MembreFamille {
  /**
   * Un identifiant unique entre les membres du foyer, pour les membre autres que le demandeur cette valuer est
   * toujours plus grande que 0.
   */
  id: number;

  /**
   * Le prénom. Ce prénom apparaît sur l'écran pour identifier la personne.
   */
  prenom: string;

  /**
   * La relation entre ce membre et le demandeur.
   */
  relation: Relation;

  /**
   * La data de naissance.
   */
  dateNaissance: Date;
}
