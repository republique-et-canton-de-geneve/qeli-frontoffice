package ch.ge.social.qeli;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

/**
 * Classe de démarrage du frontoffice.
 */
@SpringBootApplication
public class FrontofficeApplication extends SpringBootServletInitializer {

  public static void main(String[] args) {
    SpringApplication.run(FrontofficeApplication.class, args);
  }

  @Override
  protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
    return builder.properties("spring.config.name=application,Distribution")
                  .sources(FrontofficeConfiguration.class);
  }

}
