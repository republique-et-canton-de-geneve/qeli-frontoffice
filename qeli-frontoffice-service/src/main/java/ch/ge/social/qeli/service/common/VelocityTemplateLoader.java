package ch.ge.social.qeli.service.common;

import java.util.Properties;
import org.apache.velocity.Template;
import org.apache.velocity.app.VelocityEngine;
import org.springframework.stereotype.Component;

/**
 * Une class utilitaire qui permet de charger un modèle mustache.
 */
@Component
public class VelocityTemplateLoader {
  private final VelocityEngine velocityEngine;

  public VelocityTemplateLoader() {
    this.velocityEngine = new VelocityEngine();
    Properties p = new Properties();
    p.setProperty("resource.loader", "class");
    p.setProperty("class.resource.loader.class", "org.apache.velocity.runtime.resource.loader.ClasspathResourceLoader");
    this.velocityEngine.init(p);
  }

  /**
   * Charge et compile le modèle velocity avec le nom donnée.
   *
   * @param name le nom du modèle velocity.
   *
   * @return le modèle velocity compilé.
   */
  public Template load(String name) {
    return velocityEngine.getTemplate(String.format("template/%s", name));
  }
}
