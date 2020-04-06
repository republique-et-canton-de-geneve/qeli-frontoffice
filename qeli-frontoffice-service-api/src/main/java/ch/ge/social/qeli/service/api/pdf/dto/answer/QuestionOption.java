package ch.ge.social.qeli.service.api.pdf.dto.answer;

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
  T value;

  /**
   * Le libellé de la question.
   */
  I18nString label;
}
