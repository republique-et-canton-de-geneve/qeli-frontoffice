 package ch.ge.social.qeli.service.common;

import com.samskivert.mustache.Mustache;
import com.samskivert.mustache.Template;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import org.springframework.core.io.Resource;

/**
 * Une class utilitaire qui permet de charger un modèle mustache.
 */
public class MustacheTemplateLoader {

  /**
   * Charge et compile un modèle mustache pour la ressource donnée.
   *
   * @param resource la resource qui contient le modèle mustache.
   *
   * @return le modèle mustache compilé.
   */
  public static Template load(Resource resource) {
    try (Reader reader = new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8)) {
      return Mustache.compiler().compile(reader);
    } catch (IOException e) {
      throw new UncheckedIOException(e);
    }
  }

  private MustacheTemplateLoader() {
    throw new AssertionError("Non instanciable");
  }
}
