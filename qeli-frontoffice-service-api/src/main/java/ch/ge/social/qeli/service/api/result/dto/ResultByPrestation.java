package ch.ge.social.qeli.service.api.result.dto;

import java.util.List;
import lombok.Data;

/**
 * Un objet qui permet de mettre en relation une prestation avec plusieurs résultats (normalement, un pour chaque
 * membre de la famille du demandeur, et un pour le demandeur).
 */
@Data
public class ResultByPrestation {
  private Prestation   prestation;
  private List<Result> results;
}
