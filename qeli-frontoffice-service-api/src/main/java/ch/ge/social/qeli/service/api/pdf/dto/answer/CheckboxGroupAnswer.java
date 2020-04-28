package ch.ge.social.qeli.service.api.pdf.dto.answer;

import java.util.List;
import lombok.Data;
import lombok.Getter;

@Data
public class CheckboxGroupAnswer implements Answer {
  QuestionOption<String>       none;
  List<QuestionOption<String>> choices;

  @Override
  public <T> T accept(AnswerVisitorModel<T> visitor) {
    return visitor.visitCheckboxGroupAnswer(this);
  }
}
