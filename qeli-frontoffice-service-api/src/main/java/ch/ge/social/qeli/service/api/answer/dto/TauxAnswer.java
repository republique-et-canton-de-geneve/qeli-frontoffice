package ch.ge.social.qeli.service.api.answer.dto;

import ch.ge.social.qeli.service.api.answer.AnswerVisitor;
import lombok.Data;

@Data
public class TauxAnswer implements Answer {
  private Integer value;
  private boolean other;

  @Override
  public <T> T accept(AnswerVisitor<T> visitor) {
    return visitor.visitTauxAnswer(this);
  }
}
