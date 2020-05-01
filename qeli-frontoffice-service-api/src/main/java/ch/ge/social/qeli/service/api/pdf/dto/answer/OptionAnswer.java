package ch.ge.social.qeli.service.api.pdf.dto.answer;

import lombok.Data;

@Data
public class OptionAnswer<T> implements Answer {

  QuestionOption<T> value;

  @Override
  public <T> T accept(AnswerModel<T> visitor) {
    return visitor.visitOptionAnswer(this);
  }
}
