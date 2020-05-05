package ch.ge.social.qeli.service.api.demandeur.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;


/**
 * Un modèle représentant un membre de la famille du demandeur habitant sous le même foyer.
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class MembreFamille extends Personne {

  /**
   * La relation entre ce membre et le demandeur.
   */
  private Relation relation;
}
