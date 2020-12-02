import { Prestation } from '../configuration/prestation.model';
import { Demandeur, MembreFoyer, Personne, Relation } from '../configuration/demandeur.model';
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
   * L'id du membre de la famille (ou le demandeur) de cette éligibilité.
   */
  membreId: number;
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
   * @param demandeur le demandeur.
   */
  constructor(eligibilites: Eligibilite[], demandeur: Demandeur) {
    this.eligibilites = eligibilites;
    this.demandeur = demandeur;
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
                                        el.membreId === eligibilite.membreId);
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
      const membre = this.demandeur.findMembrebyId(el.membreId);
      if (el.prestation !== prestation || membre instanceof Demandeur) {
        return false;
      }
      return (membre as MembreFoyer).relation === relation;
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
   * Retrouve toutes les éligibilités qui concerne au membre donnée.
   *
   * @param membre le membre recherchée.
   *
   * @return les éligibilités concernées.
   */
  findByMembre(membre: Personne) {
    return this.eligibilites.filter(eligibilite => eligibilite.membreId === membre.id);
  }

  /**
   * Retrouve toutes les éligibilités qui concerne la ou les prestations données pour le membre en paramètre.
   *
   * @param prestations la ou les prestations recherchées.
   * @param membre le membre recherchée.
   *
   * @return les éligibilités concernées.
   */
  findByPrestationEtMembre(prestations: Prestation | Prestation[], membre: Personne) {
    const _pestations = Array.isArray(prestations) ? prestations as Prestation[] : [prestations as Prestation];
    return this.eligibilites.filter(eligibilite => eligibilite.membreId === membre.id &&
                                                   _pestations.includes(eligibilite.prestation));
  }

  /**
   * Retrouve toutes les éligibilités qui concerne la prestation donnée et au moins une des rélation en paramètre.
   *
   * @param prestations la prestation recherchée.
   * @param relations les relations recherchées.
   *
   * @return les éligibilités concernées.
   */
  findByPrestationEtRelation(prestations: Prestation | Prestation[], relations: Relation | Relation[]) {
    const _pestations = Array.isArray(prestations) ? prestations as Prestation[] : [prestations as Prestation];
    const _relations = Array.isArray(relations) ? relations as Relation[] : [relations as Relation];

    return this.eligibilites
               .filter(eligibilite => eligibilite.membreId !== 0)
               .filter(eligibilite => {
                 const membre = this.demandeur.findMembrebyId(eligibilite.membreId);
                 _pestations.includes(eligibilite.prestation) &&
                 _relations.includes((membre as MembreFoyer).relation)
               });
  }
}

