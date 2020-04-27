package ch.ge.social.qeli.service.api.pdf.dto.answer;

import lombok.Data;

@Data
public class StringAnswer implements Answer {
  String value;
  public T accept<T>(AnswerVisitorModel<E> visitor) {
    return visitor.visitTextAnswer(this);
  }
}
