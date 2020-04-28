import { Prestation } from './prestation.model';
import { Eligibilite } from '../question/eligibilite.model';
import * as moment from 'moment';

/**
 * Un enum représentant les liens possibles entre le demandeur et un membre de la famille.
 */
export enum Relation {
  EPOUX                 = 'EPOUX',
  PARTENAIRE_ENREGISTRE = 'PARTENAIRE_ENREGISTRE',
  CONCUBIN              = 'CONCUBIN',
  ENFANT                = 'ENFANT',
  PARENTS               = 'PARENTS',
  AUTRES                = 'AUTRES'
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

export interface PersonneSchema {
  id: number;
  prenom: string;
  dateNaissance: Date;
}

/**
 * Un modèle représentant une personne, soit le demandeur, soit un autre membre de sa famille.
 */
export abstract class Personne {
  /**
   * Un identifiant unique entre les membres du foyer, pour le demandeur cette valuer est toujours 0.
   */
  id: number;

  /**
   * Le prénom. Ce prénom apparaît sur l'écran pour identifier la personne.
   */
  prenom: string;

  /**
   * La data de naissance.
   */
  dateNaissance: Date;

  constructor(options: PersonneSchema) {
    this.id = options.id;
    this.prenom = options.prenom;
    this.dateNaissance = options.dateNaissance;
  }

  /**
   * Si la personne est majeur ou pas.
   */
  get isMajeur() {
    return this.age >= 18;
  }

  /**
   * L'age de la personne.
   */
  get age() {
    return moment().diff(moment(this.dateNaissance), 'years');
  }

  /**
   * Crée une nouvelle matrice d'éligibilité pour cette personne.
   */
  abstract toEligibilite(): Eligibilite[];
}

export interface DemandeurSchema extends PersonneSchema {
  etatCivil: EtatCivil;
  membresFamille?: MembreFamilleSchema[];
}

/**
 * Un modèle représentant la personne qui fait une demande auprès du questionnaire d'éligibilité.
 */
export class Demandeur extends Personne {

  /**
   * L'état civil du demandeur.
   */
  etatCivil: EtatCivil;

  /**
   * Les membres qui composent le foyer du demandeur.
   */
  membresFamille: MembreFamille[];

  constructor(options: DemandeurSchema) {
    super(options);
    this.etatCivil = options.etatCivil;
    this.membresFamille = (options.membresFamille || []).map(membre => new MembreFamille(membre));
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
      membre.toEligibilite().forEach(eligibilite =>
        eligibilites.push(eligibilite)
      )
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

export interface MembreFamilleSchema extends PersonneSchema {
  relation: Relation;
}

/**
 * Un modèle représentant un membre de la famille du demandeur habitant sous le même foyer.
 */
export class MembreFamille extends Personne {

  /**
   * La relation entre ce membre et le demandeur.
   */
  relation: Relation;


  constructor(options: MembreFamilleSchema) {
    super(options);
    this.relation = options.relation;
  }

  toEligibilite(): Eligibilite[] {
    const prestations = [Prestation.SUBSIDES, Prestation.BOURSES];

    if (this.relation === Relation.EPOUX ||
        this.relation === Relation.PARTENAIRE_ENREGISTRE) {
      prestations.push(Prestation.PC_AVS_AI);
      prestations.push(Prestation.PC_FAM);
    } else if (this.relation === Relation.CONCUBIN) {
      prestations.push(Prestation.PC_FAM);
    } else if (this.relation === Relation.ENFANT) {
      prestations.push(Prestation.PC_AVS_AI);
    }

    return prestations.map(prestation => ({
      prestation: prestation,
      membre: this
    }));
  }
}
