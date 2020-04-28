package ch.ge.social.qeli.service.api.pdf.dto.answer;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnswerValue {

  protected AnswerValue(String key, String value) {
    this.key = key;
    this.value = value;
  }

  private String key;

  private String value;

}
