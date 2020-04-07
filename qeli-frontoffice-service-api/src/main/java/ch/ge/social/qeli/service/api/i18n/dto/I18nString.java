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
  String              key;
  /**
   * Optionnellement, des paramètres de traduction.
   */
  Map<String, Object> parameters;
}
