package ch.ge.social.qeli.service.api.result.dto;

import ch.ge.social.qeli.service.api.answer.dto.Answer;
import ch.ge.social.qeli.service.api.demandeur.dto.Demandeur;
import java.util.Map;
import lombok.Data;

/**
 * Un modèle représentant le résultat du questionnaire d'éligibilité.
 */
@Data
public class QeliResult {
  /**
   * Les réponses par question.
   */
  private Map<String, Answer> answers;

  /**
   * Le résultat avec les éligibilites.
   */
  private FormResult result;

  /**
   * Le demandeur.
   */
  private Demandeur demandeur;
}
