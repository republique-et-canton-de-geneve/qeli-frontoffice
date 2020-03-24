package ch.ge.social.qeli.api.controller.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Un controller REST qui permet de récupérer des informations sur la version actuelle de l'application.
 */
@RestController
@RequestMapping("/api/configuration")
public class QeliConfigurationPropertiesController {
  private final QeliConfigurationProperties qeliConfigurationProperties;

  /**
   * Constructeur par défaut du controller.
   *
   * @param qeliConfigurationProperties la configuration du formulaire.
   */
  @Autowired
  public QeliConfigurationPropertiesController(QeliConfigurationProperties qeliConfigurationProperties) {
    this.qeliConfigurationProperties = qeliConfigurationProperties;
  }

  /**
   * Récupère les paramètres de configuration du front office de l'application.
   *
   * @return les paramètres de configuration du front office de l'application.
   */
  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public QeliConfigurationProperties getQeliConfigurationProperties() {
    return qeliConfigurationProperties;
  }
}
