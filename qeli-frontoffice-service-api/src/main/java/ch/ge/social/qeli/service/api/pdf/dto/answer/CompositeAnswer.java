package ch.ge.social.qeli.service.api.pdf.dto.answer;

import java.util.Map;
import lombok.Data;

@Data
public class CompositeAnswer implements Answer {
  Map<String, Answer> answers;

  @Override
  public <T> T accept(AnswerModel<T> visitor) throws ToAnswerValueVisitor.InvalidAnswerFormat {
    return visitor.visitCompositeAnswer(this);
  }
}
