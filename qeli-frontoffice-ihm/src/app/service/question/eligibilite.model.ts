import { Prestation } from '../configuration/prestation.model';
import { Demandeur, MembreFamille, Relation } from '../configuration/demandeur.model';
import { I18nString } from '../../core/i18n/i18nstring.model';

/**
 * Un modèle représentant l'éligibilité à une prestation pour un membre de la famille ou le demandeur.
 */
export interface Eligibilite {
  /**
   * La prestation concernée.
   */
  prestation: Prestation;

  /**
   * Le membre de la famille (ou le demandeur) de cette éligibilité.
   */
  membre: Demandeur | MembreFamille;
}

/**
 * Un modèle représentant le refus d'une éligibilité.
 */
export interface EligibiliteRefusee {
  /**
   * L'éligibilité refusée.
   */
  eligibilite: Eligibilite;

  /**
   * Le motif du refus. Si la prestation est déjà per cue le motif n'est pas obligatoire.
   */
  motif?: I18nString;

  /**
   * Si la personne a indiquée qu'elle reçoit déjà cette prestation.
   */
  dejaPercue?: boolean;
}

/**
 * Un décorateur de collection d'éligibilité qui étend ses fonctionnalités pour permettre des comparaisons complexes.
 */
export class EligibiliteGroup {
  /**
   * La liste d'éligibilités qui font partie de ce décorateur.
   */
  eligibilites: Eligibilite[];

  /**
   * Le demandeur à l'origine.
   */
  demandeur: Demandeur;

  /**
   * Crée un nouveau décorateur d'eligibilités.
   *
   * @param eligibilites la liste d'éligibilités.
   */
  constructor(eligibilites: Eligibilite[]) {
    this.eligibilites = eligibilites;
    this.demandeur = eligibilites.map(eligibilite => eligibilite.membre)
                                 .find(membre => membre.id === 0) as Demandeur;
  }

  /**
   * Si la collection décorée inclut ou non cette éligibilité.
   *
   * @param eligibilite l'éligibilité recherchée.
   *
   * @return true si la collection décorée inclut l'éligibilité en paramètres.
   */
  includes(eligibilite: Eligibilite) {
    return this.eligibilites.some(el => el.prestation === eligibilite.prestation &&
                                        el.membre.id === eligibilite.membre.id);
  }

  /**
   * Si la collection décorée inclut ou non une éligibilité avec la prestation en paramètre pour un membre avec la
   * relation spécifiée aussi dans le paramètres.
   *
   * @param prestation la prestation recherchée.
   * @param relation la relation recherchée.
   *
   * @return true si une correspondance a été trouvée.
   */
  includesPrestationWithRelation(prestation: Prestation, relation: Relation) {
    return this.eligibilites.some(el => {
      if (el.prestation !== prestation ||
          el.membre instanceof Demandeur) {
        return false;
      }
      return (el.membre as MembreFamille).relation === relation;
    });
  }

  /**
   * Retrouve toutes les éligibilités qui concerne la prestation donnée.
   *
   * @param prestations la ou les prestations recherchées.
   *
   * @return les éligibilités concernées.
   */
  findByPrestation(prestations: Prestation | Prestation[]) {
    if (Array.isArray(prestations)) {
      return this.eligibilites.filter(eligibilite => prestations.includes(eligibilite.prestation));
    } else {
      return this.eligibilites.filter(eligibilite => eligibilite.prestation === prestations);
    }
  }


  /**
   * Retrouve toutes les éligibilités qui concerne la ou les prestations données pour le membre en paramètre.
   *
   * @param prestations la ou les prestations recherchées.
   * @param membre le membre recherchée.
   *
   * @return les éligibilités concernées.
   */
  findByPrestationEtMembre(prestations: Prestation | Prestation[], membre: MembreFamille | Demandeur) {
    if (Array.isArray(prestations)) {
      return this.eligibilites.filter(eligibilite => eligibilite.membre.id == membre.id &&
                                                     prestations.includes(eligibilite.prestation));
    } else {
      return this.eligibilites.filter(eligibilite => eligibilite.membre.id == membre.id &&
                                                     eligibilite.prestation === prestations);
    }
  }
}

