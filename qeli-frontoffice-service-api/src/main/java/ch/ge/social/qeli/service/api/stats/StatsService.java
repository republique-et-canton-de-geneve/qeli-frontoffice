package ch.ge.social.qeli.service.api.stats;

import ch.ge.social.qeli.service.api.answer.InvalidAnswerFormatException;
import ch.ge.social.qeli.service.api.result.dto.QeliResult;

/**
 * Un service qui permet de persister le résultat du questionnaire d'éligibilité.
 */
public interface StatsService {

  /**
   * Persiste le résultat donné du questionnaire d'éligibilité.
   *
   * @param result le résultat du questionnaire d'éligibilité.
   *
   * @throws InvalidAnswerFormatException Si une réponse dans le résultat n'est pas lisible.
   * @throws CannotSaveStatsException     Si un problème survienne lors de l'écriture des stats.
   */
  void saveFormData(QeliResult result);
}
