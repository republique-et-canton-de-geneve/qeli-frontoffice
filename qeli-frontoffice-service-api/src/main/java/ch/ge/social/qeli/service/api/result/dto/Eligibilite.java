package ch.ge.social.qeli.service.api.result.dto;

import ch.ge.social.qeli.service.api.demandeur.dto.Personne;
import lombok.Data;

/**
 * Un modèle représentant l'éligibilité à une prestation pour un membre de la famille ou le demandeur.
 */
@Data
public class Eligibilite {
  /**
   * La prestation concernée.
   */
  private Prestation prestation;

  /**
   * Le membre de la famille (ou le demandeur) de cette éligibilité.
   */
  private Personne membre;
}