package ch.ge.social.qeli.api.controller.configuration;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.springframework.boot.context.properties.NestedConfigurationProperty;

@Data
@JsonAutoDetect(
  fieldVisibility = JsonAutoDetect.Visibility.NONE,
  setterVisibility = JsonAutoDetect.Visibility.NONE,
  getterVisibility = JsonAutoDetect.Visibility.NONE,
  isGetterVisibility = JsonAutoDetect.Visibility.NONE,
  creatorVisibility = JsonAutoDetect.Visibility.NONE
)
public class ApiConfiguration {
  @JsonProperty
  @NestedConfigurationProperty
  private RestConfiguration pdf = new RestConfiguration();

  @JsonProperty
  @NestedConfigurationProperty
  private RestConfiguration stats = new RestConfiguration();
}
