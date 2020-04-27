package ch.ge.social.qeli.service.api.pdf.dto.answer;

import lombok.Data;

@Data
public class OptionAnswer<T> implements Answer {
  QuestionOption<T> value;

  public T accept<T>(AnswerVisitorModel<E> visitor) {
    return visitor.visitOptionAnswer(this);
  }
}
