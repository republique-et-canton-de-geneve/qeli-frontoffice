import { QuestionOption } from '../../../dynamic-question/model/question.model';

/**
 * Les type de permis possibles.
 */
export enum TypePermis {
  B     = 'B',
  C     = 'C',
  F     = 'F',
  G     = 'G',
  L     = 'L',
  N     = 'N',
  S     = 'S',
  AUCUN = 'AUCUN'
}

/**
 * Crée une option pour un type de permis.
 *
 * @param typePermis le type de permis.
 */
export function typePermisToOption(typePermis: TypePermis): QuestionOption<string> {
  return {
    value: typePermis,
    label: {
      key: `common.typePermis.${typePermis}`
    }
  };
}

/**
 * Liste toutes les options des types de permis.
 */
export function typePermisOptions(): QuestionOption<string>[] {
  return Object.values(TypePermis).map(typePermisToOption);
}

/**
 * Les types de permis B possibles.
 */
export enum TypePermisB {
  ETUDES  = 'ETUDES',
  UE_AELE = 'UE_AELE',
  REFUGIE = 'REFUGIE'
}

/**
 * Crée une option pour un type de permis B.
 *
 * @param typePermisB le type de permis B.
 */
export function typePermisBToOption(typePermisB: TypePermisB): QuestionOption<string> {
  return {
    value: typePermisB,
    label: {
      key: `common.typePermisB.${typePermisB}`
    }
  };
}

/**
 * Liste toutes les options des types de permis B.
 */
export function typePermisBOptions(): QuestionOption<string>[] {
  return Object.values(TypePermisB).map(typePermisBToOption);
}

/**
 * Les types de permis C possibles.
 */
export enum TypePermisC {
  UE_AELE    = 'UE_AELE',
  CI_UE_AELE = 'CI_UE_AELE',
  CI         = 'CI',
  REFUGIE    = 'REFUGIE'
}

/**
 * Crée une option pour un type de permis C.
 *
 * @param typePermisC le type de permis C.
 */
export function typePermisCToOption(typePermisC: TypePermisC): QuestionOption<string> {
  return {
    value: typePermisC,
    label: {
      key: `common.typePermisC.${typePermisC}`
    }
  };
}

/**
 * Liste toutes les options des types de permis C.
 */
export function typePermisCOptions(): QuestionOption<string>[] {
  return Object.values(TypePermisC).map(typePermisCToOption);
}


/**
 * Les types de permis F possibles.
 */
export enum TypePermisF {
  F       = 'F',
  REFUGIE = 'REFUGIE'
}

/**
 * Crée une option pour un type de permis F.
 *
 * @param typePermisF le type de permis F.
 */
export function typePermisFToOption(typePermisF: TypePermisF): QuestionOption<string> {
  return {
    value: typePermisF,
    label: {
      key: `common.typePermisF.${typePermisF}`
    }
  };
}

/**
 * Liste toutes les options des types de permis F.
 */
export function typePermisFOptions(): QuestionOption<string>[] {
  return Object.values(TypePermisF).map(typePermisFToOption);
}
