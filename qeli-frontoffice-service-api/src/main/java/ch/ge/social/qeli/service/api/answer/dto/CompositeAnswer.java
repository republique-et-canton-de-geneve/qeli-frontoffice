package ch.ge.social.qeli.service.api.answer.dto;

import ch.ge.social.qeli.service.api.answer.AnswerVisitor;
import ch.ge.social.qeli.service.api.answer.InvalidAnswerFormatException;
import java.util.Map;
import lombok.Data;

@Data
public class CompositeAnswer implements Answer {
  private Map<String, Answer> answers;

  @Override
  public <T> T accept(AnswerVisitor<T> visitor) throws InvalidAnswerFormatException {
    return visitor.visitCompositeAnswer(this);
  }
}
