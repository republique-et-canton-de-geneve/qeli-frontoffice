package ch.ge.social.qeli.api.controller.pdf;

import ch.ge.social.qeli.service.api.pdf.dto.QeliResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ch.ge.social.qeli.service.api.stats.StatsService;

/**
 * Un controller REST qui permet de créer un PDF récapitulatif du résultat du questionnaire d'éligibilité.
 */
@RestController
@RequestMapping("/api")
public class StatsController {

  private final StatsService statsService;
  @Autowired
  public StatsController(StatsService statsService) {
    this.statsService = statsService;
  }

  /**
   * Persiste dans un fichier de log le résultat donné du questionnaire d'éligibilité.
   *
   * @param result le résultat du questionnaire d'éligibilité.
   *
   */
  @PostMapping(value = "/saveStats", consumes = {MediaType.APPLICATION_JSON_VALUE})
  void saveStats(@RequestBody QeliResult result) {
    this.statsService.saveFormData(result);
  }


}
