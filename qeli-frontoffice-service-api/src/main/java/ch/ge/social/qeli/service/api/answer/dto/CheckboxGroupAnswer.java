package ch.ge.social.qeli.service.api.answer.dto;

import ch.ge.social.qeli.service.api.answer.AnswerVisitor;
import ch.ge.social.qeli.service.api.answer.InvalidAnswerFormatException;
import java.util.List;
import java.util.Optional;
import lombok.Data;

@Data
public class CheckboxGroupAnswer implements Answer {
  private QuestionOption<String>       hasSome;
  private List<QuestionOption<String>> choices;

  @Override
  public <T> T accept(AnswerVisitor<T> visitor) throws InvalidAnswerFormatException {
    return visitor.visitCheckboxGroupAnswer(this);
  }

  public boolean isInconnuSelected() {
    return Optional.ofNullable(hasSome)
                   .map(QuestionOption::getValue)
                   .map("INCONNU"::equals)
                   .orElse(false);
  }

  public boolean isNonSelected() {
    return Optional.ofNullable(hasSome)
                   .map(QuestionOption::getValue)
                   .map("NON"::equals)
                   .orElse(false);
  }
}
