package ch.ge.social.qeli.api.controller;

import lombok.AllArgsConstructor;
import lombok.Value;

/**
 * Un DTO qui contient des informations sur un erreur produit par la REST api.
 */
@Value
@AllArgsConstructor
class ApiErrorDto {
  private final String errorCode;
  private final String errorMessage;
}
