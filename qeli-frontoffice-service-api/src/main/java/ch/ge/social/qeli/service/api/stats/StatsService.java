package ch.ge.social.qeli.service.api.stats;

import ch.ge.social.qeli.service.api.pdf.dto.QeliResult;

/**
 * Un service qui permet de persister le résultat du questionnaire d'éligibilité.
 */
public interface StatsService {

  /**
   * Persiste le résultat donné du questionnaire d'éligibilité.
   *
   * @param result le résultat du questionnaire d'éligibilité.
   *
   */
  void saveFormData(QeliResult result);
}
