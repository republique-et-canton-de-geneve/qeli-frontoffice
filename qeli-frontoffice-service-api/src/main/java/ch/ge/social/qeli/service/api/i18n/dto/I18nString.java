package ch.ge.social.qeli.service.api.i18n.dto;

import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Value;

/**
 * Un modèle représentant un string à traduire.
 */
@Value
@Builder
@AllArgsConstructor
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
