package ch.ge.social.qeli.service.api.pdf;

/**
 * Une exception qui survienne lors d'un erreur pendant la génération d'un PDF.
 */
public class PDFGenerationException extends RuntimeException {
  /**
   * @see RuntimeException#RuntimeException(String, Throwable)
   */
  public PDFGenerationException(String message, Throwable cause) {
    super(message, cause);
  }

}
