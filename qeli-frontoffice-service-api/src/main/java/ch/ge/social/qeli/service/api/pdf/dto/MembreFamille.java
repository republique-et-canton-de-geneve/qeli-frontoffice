package ch.ge.social.qeli.service.api.pdf.dto;

import java.time.LocalDate;
import lombok.Data;

/**
 * Un modèle représentant un membre du foyer, sois le demandeur sois un autre membre..
 */
@Data
public class MembreFamille {
  /**
   * Un identifiant unique entre les membres du foyer.
   */
  Integer id;

  /**
   * Le prénom. Ce prénom apparaît sur l'écran pour identifier la personne.
   */
  String prenom;

  /**
   * La data de naissance.
   */
  LocalDate dateNaissance;
}
