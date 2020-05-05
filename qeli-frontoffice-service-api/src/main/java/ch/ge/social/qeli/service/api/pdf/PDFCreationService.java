package ch.ge.social.qeli.service.api.pdf;

import ch.ge.social.qeli.service.api.result.dto.QeliResult;

/**
 * Un service qui permet de créer un PDF récapitulatif du résultat du questionnaire d'éligibilité.
 */
public interface PDFCreationService {

  /**
   * Crée un nouveau PDF récapitulatif pour le résultat donné du questionnaire d'éligibilité.
   *
   * @param result le résultat du questionnaire d'éligibilité.
   *
   * @return le PDF récapitulatif.
   *
   * @throws PDFGenerationException si un problème survient pendant la génération du PDF.
   */
  byte[] generate(QeliResult result);
}
