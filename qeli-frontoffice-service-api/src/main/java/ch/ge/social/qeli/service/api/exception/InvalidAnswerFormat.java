package ch.ge.social.qeli.service.api.exception;

public class InvalidAnswerFormat extends RuntimeException {

  public InvalidAnswerFormat(String errorMessage) {
    super(errorMessage);
  }
}
