package ch.ge.social.qeli.service.api.result.dto;

import ch.ge.social.qeli.service.api.demandeur.dto.Personne;
import ch.ge.social.qeli.service.api.i18n.dto.I18nString;
import lombok.Data;

/**
 * Un model représentant le résultat d'une éligibilité.
 */
@Data
public class Result {
  private Personne membre;
  private boolean eligible;
  private boolean dejaPercue;
  private I18nString motifRefus;
}
