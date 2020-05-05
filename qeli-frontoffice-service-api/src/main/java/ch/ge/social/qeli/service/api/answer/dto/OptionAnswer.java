package ch.ge.social.qeli.service.api.answer.dto;

import ch.ge.social.qeli.service.api.answer.AnswerVisitor;
import lombok.Data;

@Data
public class OptionAnswer<T> implements Answer {
  private QuestionOption<T> value;

  @Override
  public <E> E accept(AnswerVisitor<E> visitor) {
    return visitor.visitOptionAnswer(this);
  }
}
