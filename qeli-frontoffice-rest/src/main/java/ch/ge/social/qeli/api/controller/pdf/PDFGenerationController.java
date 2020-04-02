package ch.ge.social.qeli.api.controller.pdf;

import ch.ge.social.qeli.service.api.pdf.PDFCreationService;
import ch.ge.social.qeli.service.api.pdf.PDFGenerationException;
import ch.ge.social.qeli.service.api.pdf.dto.QeliResult;
import com.google.common.io.ByteStreams;
import java.io.IOException;
import java.io.InputStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
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
  private final Resource           src;

  @Autowired
  public PDFGenerationController(PDFCreationService pdfCreationService,
                                 @Value("classpath:/hbt.pdf") Resource src) {
    this.pdfCreationService = pdfCreationService;
    this.src = src;
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
    // TODO return this.pdfCreationService.generatePDF(form);
    try (InputStream input = src.getInputStream()) {
      return ByteStreams.toByteArray(input);
    }
  }


}
