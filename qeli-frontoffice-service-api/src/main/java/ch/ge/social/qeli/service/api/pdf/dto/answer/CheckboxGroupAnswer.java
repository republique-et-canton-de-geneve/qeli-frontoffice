package ch.ge.social.qeli.service.api.pdf.dto.answer;

import ch.ge.social.qeli.service.api.exception.InvalidAnswerFormat;
import java.util.List;
import lombok.Data;

@Data
public class CheckboxGroupAnswer implements Answer {
  QuestionOption<String>       none;
  List<QuestionOption<String>> choices;

  @Override
  public <T> T accept(AnswerVisitor<T> visitor) throws InvalidAnswerFormat {
    return visitor.visitCheckboxGroupAnswer(this);
  }
}
