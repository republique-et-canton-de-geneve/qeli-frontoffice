package ch.ge.social.qeli.api.controller.configuration;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonProperty;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.boot.context.properties.NestedConfigurationProperty;

/**
 * Configuration Matomo.
 */
@Data
@JsonAutoDetect(
  fieldVisibility = JsonAutoDetect.Visibility.NONE,
  setterVisibility = JsonAutoDetect.Visibility.NONE,
  getterVisibility = JsonAutoDetect.Visibility.NONE,
  isGetterVisibility = JsonAutoDetect.Visibility.NONE,
  creatorVisibility = JsonAutoDetect.Visibility.NONE
)
public class MatomoConfiguration {
  /**
   * L'addresse du server Matomo.
   */
  @JsonProperty
  @NotNull
  private String server;

  /**
   * L'id Matomo de cette application.
   */
  @JsonProperty
  @Min(0)
  private int siteId;

  /**
   * Active ou désactive le tracking Matomo
   */
  @JsonProperty
  private boolean enabled = true;
}
