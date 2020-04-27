package ch.ge.social.qeli.service.api.pdf.dto.answer;

import java.time.LocalDate;
import lombok.Data;

@Data
public class DateAnswer implements Answer {
  QuestionOption<String> shortcut;
  LocalDate              value;

  public T accept<T>(AnswerVisitorModel<E> visitor) {
    return visitor.visitDateAnser(this);
  }
}
