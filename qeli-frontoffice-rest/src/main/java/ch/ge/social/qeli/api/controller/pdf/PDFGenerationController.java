package ch.ge.social.qeli.api.controller.pdf;

import ch.ge.social.qeli.service.api.pdf.PDFCreationService;
import ch.ge.social.qeli.service.api.pdf.PDFGenerationException;
import ch.ge.social.qeli.service.api.result.dto.QeliResult;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
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
  public byte[] generatePDF(@RequestBody QeliResult result) throws IOException {
    return this.pdfCreationService.generate(result);
  }


}
