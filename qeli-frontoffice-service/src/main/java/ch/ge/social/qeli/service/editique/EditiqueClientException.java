package ch.ge.social.qeli.service.editique;

/**
 * Une exception qui survienne lors d'un erreur de communication avec l'éditique,
 */
public class EditiqueClientException extends RuntimeException {
  /**
   * @see RuntimeException#RuntimeException(String, Throwable)
   */
  public EditiqueClientException(String message, Throwable cause) {
    super(message, cause);
  }

}
