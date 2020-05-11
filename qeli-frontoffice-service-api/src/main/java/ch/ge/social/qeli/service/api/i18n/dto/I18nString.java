package ch.ge.social.qeli.service.api.i18n.dto;

import java.util.Map;
import lombok.Data;

/**
 * Un modèle représentant un string à traduire.
 */
@Data
public class I18nString {
  /**
   * La clé de traduction.
   */
  private String key;

  /**
   * Optionnellement, des paramètres de traduction.
   */
  private Map<String, Object> parameters;
}
