package ch.ge.social.qeli.service.api.pdf.dto;

import ch.ge.social.qeli.service.api.pdf.dto.answer.Answer;
import java.util.List;
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
  Map<String, Answer> answers;

  /**
   * Les éligibilités possibles.
   */
  List<Eligibilite> eligibilites;

  /**
   * Les éligibilités refusées ou déjà perçue.
   */
  List<EligibiliteRefusee> eligibiliteRefusees;
}
