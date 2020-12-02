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
  COLOCATAIRE           = 'COLOCATAIRE',
  AUTRE                 = 'AUTRE',
}

export const RELATION_FAMILIALE = [Relation.EPOUX, Relation.PARTENAIRE_ENREGISTRE, Relation.CONCUBIN, Relation.ENFANT];

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

  protected constructor(options: PersonneSchema) {
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
  membresFoyer?: MembreFoyerSchema[];
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
  membresFoyer: MembreFoyer[];

  constructor(options: DemandeurSchema) {
    super(options);
    this.etatCivil = options.etatCivil;
    this.membresFoyer = (options.membresFoyer || []).map(membre => new MembreFoyer(membre));
  }

  /**
   * Crée les éligibilités de base pour le demandeur et les membres de sa famille.
   */
  toEligibilite(): Eligibilite[] {
    const eligibilites: Eligibilite[] = [];

    Object.values(Prestation)
          .filter(prestation => prestation !== Prestation.SUBVENTION_HM)
          .forEach(prestation => eligibilites.push({
            prestation: prestation,
            membreId: this.id
          }));


    this.membresFamille.forEach(membre =>
      membre.toEligibilite().forEach(eligibilite =>
        eligibilites.push(eligibilite)
      )
    );

    return eligibilites;
  }

  /**
   * Retrouve un membre par son id.
   *
   * @param id l'id du membre.
   */
  findMembrebyId(id: number): Personne {
    if (id === this.id) {
      return this;
    }

    return this.membresFoyer.find(membre => membre.id === id);
  }

  get membresFamille(): MembreFoyer[] {
    return this.membresFoyer.filter(membre => RELATION_FAMILIALE.includes(membre.relation));
  }

  /**
   * Tous les enfants de ce demandeur.
   */
  get enfants(): MembreFoyer[] {
    return this.membresFoyer.filter(membre => membre.relation === Relation.ENFANT);
  }

  /**
   * Le partenaire du demandeur (epoux, concubin ou partenaire enregistré).
   */
  get partenaire(): MembreFoyer {
    return this.membresFoyer.find(membre =>
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
    return this.membresFoyer.some(membre => membre.relation === Relation.CONCUBIN);
  }

  /**
   * Nombre total des personnes du foyer, demandeur inclu.
   */
  get nombrePersonnesFoyer(): number {
    return this.membresFoyer.length + 1;
  }

}

export interface MembreFoyerSchema extends PersonneSchema {
  relation: Relation;
}

/**
 * Un modèle représentant un membre du foyer du demandeur.
 */
export class MembreFoyer extends Personne {

  /**
   * La relation entre ce membre et le demandeur.
   */
  relation: Relation;


  constructor(options: MembreFoyerSchema) {
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
      membreId: this.id
    }));
  }

  /**
   * Si ce membre est le conjoint du demandeur.
   */
  get isConjoint() {
    return this.relation === Relation.PARTENAIRE_ENREGISTRE ||
           this.relation === Relation.EPOUX;
  }

  /**
   * Si ce membre est le concubin du demandeur.
   */
  get isConcubin() {
    return this.relation === Relation.CONCUBIN;
  }

  /**
   * Si les informations de saisie de ce membre sont optionnelles
   */
  get isOptional() {
    return this.relation === Relation.COLOCATAIRE || this.relation === Relation.AUTRE;
  }
}
