package ch.ge.social.qeli.service.api.pdf.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Value;

/**
 * Un modèle représentant l'éligibilité à une prestation pour un membre de la famille ou le demandeur.
 */
@Value
@AllArgsConstructor
@Builder
public class Eligibilite {
  /**
   * La prestation concernée.
   */
  Prestation prestation;

  /**
   * Le membre de la famille (ou le demandeur) de cette éligibilité.
   */
  MembreFamille membre;
}
