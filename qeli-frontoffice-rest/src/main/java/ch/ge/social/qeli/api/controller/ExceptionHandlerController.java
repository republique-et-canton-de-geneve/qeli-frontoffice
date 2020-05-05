package ch.ge.social.qeli.api.controller;

import ch.ge.social.qeli.service.api.answer.InvalidAnswerFormatException;
import ch.ge.social.qeli.service.api.pdf.PDFGenerationException;
import java.util.UUID;
import javax.validation.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.UnsatisfiedServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import ch.ge.social.qeli.service.api.stats.CannotSaveStatsException;

/**
 * Un controller advice contenant le mapping des exception fonctionelles et son status HTTP.
 */
@ControllerAdvice
public class ExceptionHandlerController extends ResponseEntityExceptionHandler {
  private static final String DEFAULT_ERROR_MESSAGE = "Voir le détail dans les logs";

  private final boolean displayErrorMessage;

  /**
   * Crée une nouvelle instance de {@link ExceptionHandlerController}.
   *
   * @param displayErrorMessage si true le détail de l'erreur sera visible pour l'utilisateur, sinon un message
   *                            générique sera envoyé.
   */
  public ExceptionHandlerController(
    @Value("${social.tools.frontoffice.send-error-message:true}") boolean displayErrorMessage
  ) {
    this.displayErrorMessage = displayErrorMessage;
  }

  /**
   * Intercepte toute exception appropriée pour le status HTTP: {@link HttpStatus#FORBIDDEN}.
   *
   * @param ex l'exception à gérer.
   *
   * @return un objet avec des informations sur l'erreur.
   *
   * @see SecurityException
   */
  @ExceptionHandler(
    {
      SecurityException.class,
      AccessDeniedException.class
    }
  )
  public ResponseEntity<ApiErrorDto> forbidden(RuntimeException ex) {
    return buildResponseEntity(handleError(ex), HttpStatus.FORBIDDEN);
  }

  /**
   * Intercepte toute exception appropriée pour le status HTTP : {@link HttpStatus#BAD_REQUEST}.
   *
   * @param ex l'exception à gérer.
   *
   * @return un objet avec des informations sur l'erreur.
   *
   * @see ConstraintViolationException
   * @see MethodArgumentTypeMismatchException
   * @see UnsatisfiedServletRequestParameterException
   */
  @ExceptionHandler(
    {
      ConstraintViolationException.class,
      MethodArgumentTypeMismatchException.class,
      UnsatisfiedServletRequestParameterException.class,
      InvalidAnswerFormatException.class
    }
  )
  public ResponseEntity<ApiErrorDto> badRequest(RuntimeException ex) {
    return buildResponseEntity(handleError(ex), HttpStatus.BAD_REQUEST);
  }

  /**
   * Intercepte toute exception appropriée pour le status HTTP : {@link HttpStatus#SERVICE_UNAVAILABLE}.
   *
   * @param ex l'exception à gérer.
   *
   * @return un objet avec des informations sur l'erreur.
   *
   * @see PDFGenerationException
   */
  @ExceptionHandler({
                      PDFGenerationException.class,
                      CannotSaveStatsException.class
                    })
  public ResponseEntity<ApiErrorDto> serviceUnavailable(RuntimeException ex) {
    return buildResponseEntity(handleError(ex), HttpStatus.SERVICE_UNAVAILABLE);
  }


  /**
   * Intercepte toute exception appropriée pour le status HTTP : {@link HttpStatus#INTERNAL_SERVER_ERROR}.
   *
   * @param ex l'exception à gérer.
   *
   * @return un objet avec des informations sur l'erreur.
   *
   * @see Exception
   */
  @ExceptionHandler(Exception.class)
  public ResponseEntity<ApiErrorDto> serverError(Exception ex) {
    return buildResponseEntity(handleError(ex), HttpStatus.INTERNAL_SERVER_ERROR);
  }

  @Override
  protected ResponseEntity<Object> handleExceptionInternal(Exception ex,
                                                           Object body,
                                                           HttpHeaders headers,
                                                           HttpStatus status,
                                                           WebRequest request) {
    return super.handleExceptionInternal(ex, handleError(ex), headers, status, request);
  }

  private ApiErrorDto handleError(Exception ex) {
    String uuid = UUID.randomUUID().toString();
    logger.error(String.format("Une exception opérationnelle a été intercepté, le code d'erreur est: [%s]", uuid), ex);
    return new ApiErrorDto(uuid, (displayErrorMessage) ? DEFAULT_ERROR_MESSAGE : ex.getMessage());
  }

  private ResponseEntity<ApiErrorDto> buildResponseEntity(ApiErrorDto apiError, HttpStatus status) {
    return new ResponseEntity<>(apiError, status);
  }
}
