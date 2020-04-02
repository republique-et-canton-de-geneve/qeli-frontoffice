package ch.ge.social.qeli.service.api.pdf.dto;

import ch.ge.social.qeli.service.api.pdf.dto.answer.Answer;
import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Value;

/**
 * Un modèle représentant le résultat du questionnaire d'éligibilité.
 */
@Value
@AllArgsConstructor
@Builder
public class QeliResult {
  /**
   * Les réponses par question.
   */
  Map<String, Answer> answers;
  /**
   * Les éligibilités possibles.
   */
  List<Eligibilite>   eligibilites;
  /**
   * Les éligibilités refusées ou déjà perçue.
   */
  List<EligibiliteRefusee> eligibiliteRefusees;
}
