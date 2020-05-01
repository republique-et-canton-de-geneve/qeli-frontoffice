package ch.ge.social.qeli.service.api.pdf.dto.answer;

import lombok.Data;

@Data
public class StringAnswer implements Answer {

  String value;

  @Override
  public <T> T accept(AnswerModel<T> visitor) {
    return visitor.visitTextAnswer(this);
  }
}
