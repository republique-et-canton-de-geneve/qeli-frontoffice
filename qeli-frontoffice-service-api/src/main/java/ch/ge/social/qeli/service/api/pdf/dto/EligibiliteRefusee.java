package ch.ge.social.qeli.service.api.pdf.dto;

import ch.ge.social.qeli.service.api.i18n.dto.I18nString;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Value;

/**
 * Un modèle représentant le refus d'une éligibilité.
 */
@Value
@AllArgsConstructor
@Builder
public class EligibiliteRefusee {
  /**
   * L'éligibilité refusée.
   */
  Eligibilite eligibilite;

  /**
   * Le motif du refus. Si la prestation est déjà per cue le motif n'est pas obligatoire.
   */
  I18nString motif;

  /**
   * Si la personne a indiquée qu'elle reçoit déjà cette prestation.
   */
  @Builder.Default
  boolean dejaPercue = false;
}
