/*
 * qeli-frontoffice
 *
 * Copyright (C) 2019-2021 Republique et canton de Geneve
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
