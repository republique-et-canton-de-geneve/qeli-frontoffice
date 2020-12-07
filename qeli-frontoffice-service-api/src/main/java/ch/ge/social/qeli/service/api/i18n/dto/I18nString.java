package ch.ge.social.qeli.service.api.i18n.dto;

import java.util.Collections;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

/**
 * Un modèle représentant un string à traduire.
 */
@Data
@NoArgsConstructor
@RequiredArgsConstructor
@AllArgsConstructor
public class I18nString {
  /**
   * La clé de traduction.
   */
  @NonNull
  private String key;

  /**
   * Optionnellement, des paramètres de traduction.
   */
  private Map<String, Object> parameters = Collections.emptyMap();
}
