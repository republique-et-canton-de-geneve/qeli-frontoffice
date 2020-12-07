package ch.ge.social.qeli.service.api.demandeur.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Un enum représentant les liens possibles entre le demandeur et un membre de la famille.
 */
@Getter
@AllArgsConstructor
public enum Relation {
  EPOUX(true),
  PARTENAIRE_ENREGISTRE(true),
  CONCUBIN(true),
  ENFANT(true),
  COLOCATAIRE(false),
  AUTRE(false);

  private final boolean isMembreFamille;

}
