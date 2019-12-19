package ch.ge.social.qeli.api;

import ch.ge.social.qeli.api.formatter.UriEncodedAnnotationFormatterFactory;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Class de configuration spring pour le REST API de l'application.
 */
@Configuration
@ComponentScan("ch.ge.social.qeli.api")
@EnableAutoConfiguration
public class APIEndpointConfiguration implements WebMvcConfigurer {
  @Override
  public void addFormatters(FormatterRegistry registry) {
    registry.addFormatterForFieldAnnotation(new UriEncodedAnnotationFormatterFactory());
  }
}
