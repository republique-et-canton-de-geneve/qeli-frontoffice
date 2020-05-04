package ch.ge.social.qeli.service.api.pdf.dto.answer;

import ch.ge.social.qeli.service.api.exception.InvalidAnswerFormat;
import java.util.Map;
import lombok.Data;

@Data
public class CompositeAnswer implements Answer {
  Map<String, Answer> answers;

  @Override
  public <T> T accept(AnswerVisitor<T> visitor) throws InvalidAnswerFormat {
    return visitor.visitCompositeAnswer(this);
  }
}
