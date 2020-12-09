package ch.ge.social.qeli.api;

import ch.ge.social.qeli.api.formatter.UriEncodedAnnotationFormatterFactory;
import com.captcha.botdetect.web.servlet.SimpleCaptchaServlet;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Classe de configuration Spring pour l'API REST de l'application.
 */
@Configuration
@ComponentScan("ch.ge.social.qeli.api")
@EnableAutoConfiguration
public class APIEndpointConfiguration implements WebMvcConfigurer {
  @Override
  public void addFormatters(FormatterRegistry registry) {
    registry.addFormatterForFieldAnnotation(new UriEncodedAnnotationFormatterFactory());
  }

  @Bean
  ServletRegistrationBean captchaServletRegistration() {
    ServletRegistrationBean<SimpleCaptchaServlet> srb = new ServletRegistrationBean<>();
    srb.setServlet(new SimpleCaptchaServlet());
    srb.addUrlMappings("/api/captcha");
    return srb;
  }
}
