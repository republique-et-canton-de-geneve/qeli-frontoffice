package ch.ge.social.qeli.service.api.demandeur.dto;

import java.time.LocalDate;
import lombok.Data;

/**
 * Un modèle représentant un membre du foyer, sois le demandeur sois un autre membre..
 */
@Data
public class Personne {
  /**
   * Un identifiant unique entre les membres du foyer.
   */
  private Integer id;

  /**
   * Le prénom. Ce prénom apparaît sur l'écran pour identifier la personne.
   */
  private String prenom;

  /**
   * La data de naissance.
   */
  private LocalDate dateNaissance;
}
