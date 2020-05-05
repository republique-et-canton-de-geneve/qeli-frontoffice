package ch.ge.social.qeli.service.api.demandeur.dto;

import java.util.List;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Un modèle représentant la personne qui fait une demande auprès du questionnaire d'éligibilité.
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class Demandeur extends Personne {
  /**
   * L'état civil du demandeur.
   */
  private EtatCivil etatCivil;

  /**
   * Les membres qui composent le foyer du demandeur.
   */
  private List<MembreFamille> membresFamille;
}
