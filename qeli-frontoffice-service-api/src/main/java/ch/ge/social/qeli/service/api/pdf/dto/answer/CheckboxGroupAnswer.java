package ch.ge.social.qeli.service.api.pdf.dto.answer;

import java.util.List;
import lombok.Data;
import lombok.Getter;

@Data
public class CheckboxGroupAnswer implements Answer {
  QuestionOption<String>       none;
  List<QuestionOption<String>> choices;
  public T accept<T>(AnswerVisitorModel<E> visitor) {
    return visitor.visitCheckboxGroupAnswer(this);
  }

}
