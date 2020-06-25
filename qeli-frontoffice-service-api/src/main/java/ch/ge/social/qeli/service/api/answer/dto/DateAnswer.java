package ch.ge.social.qeli.service.api.answer.dto;

import ch.ge.social.qeli.service.api.answer.AnswerVisitor;
import java.time.LocalDate;
import lombok.Data;

@Data
public class DateAnswer implements Answer {
  private QuestionOption<String> shortcut;
  private LocalDate              value;

  @Override
  public <T> T accept(AnswerVisitor<T> visitor) {
    return visitor.visitDateAnswer(this);
  }
}
