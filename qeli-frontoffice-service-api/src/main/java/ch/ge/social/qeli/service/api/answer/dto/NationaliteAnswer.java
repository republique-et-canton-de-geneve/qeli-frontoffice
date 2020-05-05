package ch.ge.social.qeli.service.api.answer.dto;

import ch.ge.social.qeli.service.api.answer.AnswerVisitor;
import java.util.List;
import lombok.Data;

@Data
public class NationaliteAnswer implements Answer {
  private List<QuestionOption<String>> pays;
  private boolean                      apatride;

  @Override
  public <T> T accept(AnswerVisitor<T> visitor) {
    return visitor.visitNationaliteAnswer(this);
  }
}
