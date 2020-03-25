export enum Prestation {
  SUBSIDES            = 'SUBSIDES',
  AVANCES             = 'AVANCES',
  ALLOCATION_LOGEMENT = 'ALLOCATION_LOGEMENT',
  SUBVENTION_HM       = 'SUBVENTION_HM',
  PC_AVS_AI           = 'PC_AVS_AI',
  PC_AVS_AI_CONJOINT  = 'PC_AVS_AI_CONJOINT',
  PC_AVS_AI_ENFANTS   = 'PC_AVS_AI_ENFANTS',
  BOURSES             = 'BOURSES',
  PC_FAM              = 'PC_FAM',
  AIDE_SOCIALE        = 'AIDE_SOCIALE'
}

export const PRESTATIONS_AVS_AI = [
  Prestation.PC_AVS_AI,
  Prestation.PC_AVS_AI_CONJOINT,
  Prestation.PC_AVS_AI_ENFANTS
];
