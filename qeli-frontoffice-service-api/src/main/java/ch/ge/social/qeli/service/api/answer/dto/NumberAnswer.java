package ch.ge.social.qeli.service.api.answer.dto;

import ch.ge.social.qeli.service.api.answer.AnswerVisitor;
import lombok.Data;

@Data
public class NumberAnswer implements Answer {
  private Double value;

  @Override
  public <T> T accept(AnswerVisitor<T> visitor) {
    return visitor.visitNumberAnswer(this);
  }
}
