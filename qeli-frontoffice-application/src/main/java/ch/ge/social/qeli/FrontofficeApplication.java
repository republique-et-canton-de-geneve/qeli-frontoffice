package ch.ge.social.qeli;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

/**
 * Classe de démarrage du front office.
 */
@SpringBootApplication
public class FrontofficeApplication extends SpringBootServletInitializer {

  public static void main(String[] args) {
    SpringApplication.run(FrontofficeApplication.class, args);
  }


  @Override
  public void onStartup(ServletContext servletContext) throws ServletException {
    servletContext.setInitParameter("BDC_configFileLocation", "/botdetect.xml");
    super.onStartup(servletContext);
  }

  @Override
  protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
    return builder.properties("spring.config.name=application,Distribution")
                  .sources(FrontofficeConfiguration.class);
  }

}
