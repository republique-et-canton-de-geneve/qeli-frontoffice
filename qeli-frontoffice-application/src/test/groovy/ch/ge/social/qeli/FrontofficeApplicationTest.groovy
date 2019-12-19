package ch.ge.social.qeli

import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.DirtiesContext
import org.springframework.test.context.ActiveProfiles
import spock.lang.Specification

/**
 * Vérifie que l'application démarre avec le profile development activé.
 *
 * <p>
 *   L'annotation {@link DirtiesContext} est utilisée pour démonter le context spring a la fin
 *   d'execution des tests.
 * </p>
 */
@SpringBootTest
@ActiveProfiles("development")
@DirtiesContext
class FrontofficeApplicationTest extends Specification {

  def "Le context démarre avec le profile development activé"() {
    expect: "Quand l'éxecution arrive ici le context spring a démarré"
    true
  }

}
