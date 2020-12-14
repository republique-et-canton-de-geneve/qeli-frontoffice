package ch.ge.social.qeli.api.interceptor;

/**
 * Une exception qui survienne lors que le captche introduit par l'utilsiatrice n'est pas valide.
 */
public class InvalidCaptchaException extends RuntimeException {
  /**
   * @see RuntimeException#RuntimeException(String)
   */
  public InvalidCaptchaException(String message) {
    super(message);
  }

}
