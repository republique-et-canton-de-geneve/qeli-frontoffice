package ch.ge.social.qeli.service.api.answer.dto;

import ch.ge.social.qeli.service.api.i18n.dto.I18nString;
import lombok.Data;

/**
 * Un modèle représentant un choix pour une question avec multiple options.
 */
@Data
public class QuestionOption<T> {
  /**
   * La valeur de cette option.
   */
  private T value;

  /**
   * Le libellé de la question.
   */
  private I18nString label;
}
