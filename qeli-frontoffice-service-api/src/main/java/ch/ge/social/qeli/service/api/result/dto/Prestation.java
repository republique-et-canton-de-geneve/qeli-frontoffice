package ch.ge.social.qeli.service.api.result.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Un enum représentant toutes les prestations connues par le questionnaire d'éligibilité.
 */
@AllArgsConstructor
@Getter
public enum Prestation {
  /**
   * Subsides d'assurance-maladie. Tous les membres du foyer peuvent bénéficier individuellement de cette prestation.
   */
  SUBSIDES(true),
  /**
   * Avances de pensions alimentaires. Prestation valable seulement pour le demandeur.
   */
  AVANCES(false),
  /**
   * Allocation logement. Prestation valable seulement pour le demandeur.
   */
  ALLOCATION_LOGEMENT(false),
  /**
   * Prestations complémentaires AVS/AI. Tous les membres du foyer peuvent bénéficier individuellement de cette
   * prestation, l'éligibilité des concubins·es n'est pas calculée.
   */
  PC_AVS_AI(false),
  /**
   * Bourses d'études. Tous les membres du foyer peuvent bénéficier individuellement de cette prestation.
   */
  BOURSES(true),
  /**
   * Prestations complémentaires familiales. Prestation valable pour tout le foyer.
   */
  PC_FAM(false),
  /**
   * Aide Sociale. Prestation valable seulement pour le demandeur.
   */
  AIDE_SOCIALE(false);

  private final boolean prestationIndividuel;
}
