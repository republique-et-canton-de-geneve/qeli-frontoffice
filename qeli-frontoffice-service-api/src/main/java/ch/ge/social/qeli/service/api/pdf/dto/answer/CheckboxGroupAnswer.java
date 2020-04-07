package ch.ge.social.qeli.service.api.pdf.dto.answer;

import java.util.List;
import lombok.Data;

@Data
public class CheckboxGroupAnswer implements Answer {
  QuestionOption<String>       none;
  List<QuestionOption<String>> choices;
}
