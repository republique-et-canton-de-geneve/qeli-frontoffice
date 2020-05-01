package ch.ge.social.qeli.service.api.pdf.dto.answer;

import java.util.List;
import lombok.Data;

@Data
public class NationaliteAnswer implements Answer {
  List<QuestionOption<String>> pays;
  boolean                      apatride;


  @Override
  public <T> T accept(AnswerModel<T> visitor) {
    return visitor.visitNationaliteAnswer(this);
  }
}
