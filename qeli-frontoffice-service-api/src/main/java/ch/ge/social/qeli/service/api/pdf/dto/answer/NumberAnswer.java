package ch.ge.social.qeli.service.api.pdf.dto.answer;

import lombok.Data;

@Data
public class NumberAnswer implements Answer {
  Double value;

  @Override
  public <T> T accept(AnswerVisitor<T> visitor) {
    return visitor.visitNumberAnswer(this);
  }
}
