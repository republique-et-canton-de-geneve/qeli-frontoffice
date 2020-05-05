package ch.ge.social.qeli.service.api.result.dto;

/**
 * Un enum représentant toutes les prestations connues par le questionnaire d'éligibilité.
 */
public enum Prestation {
  /**
   * Subsides d'assurance-maladie. Tous les membres du foyer peuvent bénéficier individuellement de cette prestation.
   */
  SUBSIDES,
  /**
   * Avances de pensions alimentaires. Prestation valable seulement pour le demandeur.
   */
  AVANCES,
  /**
   * Allocation logement. Prestation valable seulement pour le demandeur.
   */
  ALLOCATION_LOGEMENT,
  /**
   * Prestations complémentaires AVS/AI. Tous les membres du foyer peuvent bénéficier individuellement de cette
   * prestation, l'éligibilité des concubins·es n'est pas calculée.
   */
  PC_AVS_AI,
  /**
   * Bourses d'études. Tous les membres du foyer peuvent bénéficier individuellement de cette prestation.
   */
  BOURSES,
  /**
   * Prestations complémentaires familiales. Prestation valable pour tout le foyer.
   */
  PC_FAM,
  /**
   * Aide Sociale. Prestation valable seulement pour le demandeur.
   */
  AIDE_SOCIALE
}
