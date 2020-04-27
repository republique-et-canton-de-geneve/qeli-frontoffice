package ch.ge.social.qeli.service.api.pdf.dto.answer;

import lombok.Data;

@Data
public class NumberAnswer implements Answer {
  Double value;

  public T accept<T>(AnswerVisitorModel<E> visitor) {
    return visitor.visitNumberAnswer(this);
  }
}
