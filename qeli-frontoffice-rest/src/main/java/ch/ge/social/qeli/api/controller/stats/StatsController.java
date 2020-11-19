package ch.ge.social.qeli.api.controller.stats;

import ch.ge.social.qeli.service.api.result.dto.QeliResult;
import ch.ge.social.qeli.service.api.stats.StatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Un controller REST qui permet de enregistrer le résultat du questionnaire d'éligibilité pour en faire des
 * statistiques.
 */
@RestController
@RequestMapping("/api")
@ConditionalOnExpression("${social.tools.qeli.api.stats.enabled:true}")
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
   */
  @PostMapping(value = "/saveStats", consumes = {MediaType.APPLICATION_JSON_VALUE})
  void saveStats(@RequestBody QeliResult result) {
    this.statsService.saveFormData(result);
  }


}
