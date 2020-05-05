package ch.ge.social.qeli.service.api.stats;

/**
 * Une exception qui survienne lors qu'il n'est pas possible de sauvegarder les statistiques du formulaire.
 */
public class CannotSaveStatsException extends RuntimeException {
  /**
   * @see RuntimeException#RuntimeException(String, Throwable)
   */
  public CannotSaveStatsException(String message, Throwable cause) {
    super(message, cause);
  }
}
