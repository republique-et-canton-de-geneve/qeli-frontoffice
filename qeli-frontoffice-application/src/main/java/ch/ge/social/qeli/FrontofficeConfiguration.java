package ch.ge.social.qeli;

import ch.ge.social.qeli.api.APIEndpointConfiguration;
import ch.ge.social.qeli.security.SecurityConfiguration;
import ch.ge.social.qeli.service.ServiceConfiguration;
import ch.ge.social.qeli.serviceapi.ServiceAPIConfiguration;
import java.util.regex.Pattern;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.core.convert.ConversionService;
import org.springframework.format.support.DefaultFormattingConversionService;

/**
 * Classe de configuration Spring agrégeant toutes les configurations des différents modules du front office.
 */
@Configuration
@Import(
  {
    FrontofficeIHMConfiguration.class,
    ServiceConfiguration.class,
    APIEndpointConfiguration.class,
    SecurityConfiguration.class,
    ServiceAPIConfiguration.class
  }
)
public class FrontofficeConfiguration {

  @Bean
  public ConversionService conversionService() {
    DefaultFormattingConversionService conversionService = new DefaultFormattingConversionService();
    conversionService.addConverter(String.class, Pattern.class, Pattern::compile);
    return conversionService;
  }

}
