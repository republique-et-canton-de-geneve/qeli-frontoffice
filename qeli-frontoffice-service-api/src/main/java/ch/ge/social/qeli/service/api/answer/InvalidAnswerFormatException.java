package ch.ge.social.qeli.service.api.answer;

/**
 * Une exception qui survienne lors qu'une réponse n'est pas dans le format attendu.
 */
public class InvalidAnswerFormatException extends RuntimeException {
  /**
   * @see RuntimeException#RuntimeException(String, Throwable)
   */
  public InvalidAnswerFormatException(String message, Throwable cause) {
    super(message, cause);
  }
}
