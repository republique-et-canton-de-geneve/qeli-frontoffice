package ch.ge.social.qeli.service.api.answer.dto;

import ch.ge.social.qeli.service.api.answer.AnswerVisitor;
import java.util.Optional;
import lombok.Data;

@Data
public class DropdownAnswer<T> implements Answer {
  private QuestionOption<T>      value;
  private QuestionOption<String> hasSome;

  @Override
  public <E> E accept(AnswerVisitor<E> visitor) {
    return visitor.visitDropdownAnswer(this);
  }


  public boolean isInconnuSelected() {
    return Optional.ofNullable(hasSome)
                   .map(QuestionOption::getValue)
                   .map("INCONNU"::equals)
                   .orElse(false);
  }
}
