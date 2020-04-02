package ch.ge.social.qeli.service.api.pdf.dto.answer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Value;

@Value
@AllArgsConstructor
@Builder
public class OptionAnswer<T> implements Answer {
  QuestionOption<T> option;
}
