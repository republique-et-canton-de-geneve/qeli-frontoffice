package ch.ge.social.qeli.service.api.pdf.dto.answer;

import java.util.List;
import lombok.Data;

@Data
public class NationaliteAnswer implements Answer {
  List<QuestionOption<String>> pays;
  boolean                      apatride;

  public T accept<T>(AnswerVisitorModel<E> visitor) {
    return visitor.visitNationaliteAnswer(this);
  }
}
