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

package ch.ge.social.qeli.api.controller.pdf;

import ch.ge.social.qeli.api.interceptor.Captcha;
import ch.ge.social.qeli.service.api.pdf.PDFCreationService;
import ch.ge.social.qeli.service.api.pdf.PDFGenerationException;
import ch.ge.social.qeli.service.api.result.dto.QeliResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Un controller REST qui permet de créer un PDF récapitulatif du résultat du questionnaire d'éligibilité.
 */
@RestController
@RequestMapping("/api")
@ConditionalOnExpression("${social.tools.qeli.api.pdf.enabled:true}")
public class PDFGenerationController {

  private final PDFCreationService pdfCreationService;

  @Autowired
  public PDFGenerationController(PDFCreationService pdfCreationService) {
    this.pdfCreationService = pdfCreationService;
  }

  /**
   * Crée un nouveau PDF récapitulatif pour le résultat donné du questionnaire d'éligibilité.
   *
   * @param result le résultat du questionnaire d'éligibilité.
   *
   * @return le PDF récapitulatif.
   *
   * @throws PDFGenerationException si un problème survient pendant la génération du PDF.
   */
  @PostMapping(value = "/pdf", consumes = {MediaType.APPLICATION_JSON_VALUE})
  @Captcha
  public byte[] generatePDF(@RequestBody QeliResult result) {
    return this.pdfCreationService.generate(result);
  }


}
