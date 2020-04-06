package ch.ge.social.qeli.api.controller;

import lombok.Value;

/**
 * Un DTO qui contient des informations sur une erreur produite par l'API REST.
 */
@Value
class ApiErrorDto {
  private final String errorCode;
  private final String errorMessage;
}
