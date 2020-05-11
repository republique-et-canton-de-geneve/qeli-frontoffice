package ch.ge.social.qeli.service.api.result.dto;

import ch.ge.social.qeli.service.api.i18n.dto.I18nString;
import lombok.Data;

/**
 * Un modèle représentant le refus d'une éligibilité.
 */
@Data
public class EligibiliteRefusee {
  /**
   * L'éligibilité refusée.
   */
  private Eligibilite eligibilite;

  /**
   * Le motif du refus. Si la prestation est déjà per cue le motif n'est pas obligatoire.
   */
  private I18nString motif;

  /**
   * Si la personne a indiquée qu'elle reçoit déjà cette prestation.
   */
  private boolean dejaPercue = false;
}
