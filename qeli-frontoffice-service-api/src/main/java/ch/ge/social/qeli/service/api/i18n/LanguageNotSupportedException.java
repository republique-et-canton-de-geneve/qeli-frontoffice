package ch.ge.social.qeli.service.api.i18n;

/**
 * Une exception qui survienne lors du chargement d'un fichier de traduction d'un langue pas supportée.
 */
public class LanguageNotSupportedException extends RuntimeException {
  /**
   * @see RuntimeException#RuntimeException(String, Throwable)
   */
  public LanguageNotSupportedException(String message, Throwable cause) {
    super(message, cause);
  }
}
