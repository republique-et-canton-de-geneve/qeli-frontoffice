package ch.ge.social.qeli.api.controller.pdf;

import ch.ge.social.qeli.service.api.pdf.dto.QeliResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ch.ge.social.qeli.service.api.persistence.PersistenceService;

/**
 * Un controller REST qui permet de créer un PDF récapitulatif du résultat du questionnaire d'éligibilité.
 */
@RestController
@RequestMapping("/api")
public class PersistenceController {

  private final PersistenceService persistenceService;
  @Autowired
  public PersistenceController(PersistenceService persistenceService) {
    this.persistenceService = persistenceService;
  }

  /**
   * Persiste dans un fichier de log le résultat donné du questionnaire d'éligibilité.
   *
   * @param result le résultat du questionnaire d'éligibilité.
   *
   */
  @PostMapping(value = "/persistData", consumes = {MediaType.APPLICATION_JSON_VALUE})
  void persistData(@RequestBody QeliResult result) {
    this.persistenceService.saveFormData(result);
  }


}
