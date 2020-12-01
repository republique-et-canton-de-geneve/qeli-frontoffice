package ch.ge.social.qeli.service.api.result.dto;

import java.util.List;
import lombok.Data;

/**
 * Le résultat d'éligibilité d'après le questionnaire.
 */
@Data
public class FormResult {
  private List<ResultByPrestation> prestationsEligibles;
  private List<ResultByPrestation> prestationsDejaPercues;
  private List<ResultByPrestation> prestationsRefusees;
}
