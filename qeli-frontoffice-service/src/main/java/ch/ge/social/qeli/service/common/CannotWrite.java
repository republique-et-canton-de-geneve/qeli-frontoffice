package ch.ge.social.qeli.service.common;

public class CannotWrite extends RuntimeException {

  public CannotWrite(String errorMessage) {
    super(errorMessage);
  }
}
