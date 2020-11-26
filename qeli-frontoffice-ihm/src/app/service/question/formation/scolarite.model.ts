import { QuestionOption } from '../../../dynamic-question/model/question.model';

export enum Scolarite {
  SCOLARITE_OBLIGATOIRE_1P_A_11P = 'SCOLARITE_OBLIGATOIRE_1P_A_11P',
  COLLEGE_APRENTISSAGE           = 'COLLEGE_APRENTISSAGE',
  CLASSE_PREPARATOIRE            = 'CLASSE_PREPARATOIRE',
  ECOLE_SUPERIEUR                = 'ECOLE_SUPERIEUR',
  BREVET                         = 'BREVET',
  UNIVERSITE_MASTER              = 'UNIVERSITE_MASTER',
  UNIVERSITE_DOCTORAT            = 'UNIVERSITE_DOCTORAT',
  FORMATION_CONTINUE_CERTIFIANTE = 'FORMATION_CONTINUE_CERTIFIANTE',
  FORMATION_CONTINUE_COURTE      = 'FORMATION_CONTINUE_COURTE',
  FORMATION_CONTINUE_AUTRE       = 'FORMATION_CONTINUE_AUTRE',
  AUTRE_FORMATION                = 'AUTRE_FORMATION'
}

/**
 * Crée une option pour un type de scolarité.
 *
 * @param typeScolarite le type de scolarité.
 */
export function typeScolariteToOption(typeScolarite: Scolarite): QuestionOption<string> {
  return {
    value: typeScolarite,
    label: {
      key: `common.scolarite.${typeScolarite}`
    }
  };
}

/**
 * Liste toutes les options des types de scolarités.
 */
export function typeScolariteOptions(): QuestionOption<string>[] {
  return Object.values(Scolarite).map(typeScolariteToOption);
}
