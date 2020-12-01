package ch.ge.social.qeli.service.stats;

import ch.ge.social.qeli.service.api.answer.AnswerVisitor;
import ch.ge.social.qeli.service.api.answer.InvalidAnswerFormatException;
import ch.ge.social.qeli.service.api.answer.dto.Answer;
import ch.ge.social.qeli.service.api.answer.dto.CheckboxGroupAnswer;
import ch.ge.social.qeli.service.api.answer.dto.CompositeAnswer;
import ch.ge.social.qeli.service.api.answer.dto.DateAnswer;
import ch.ge.social.qeli.service.api.answer.dto.DropdownAnswer;
import ch.ge.social.qeli.service.api.answer.dto.NationaliteAnswer;
import ch.ge.social.qeli.service.api.answer.dto.NumberAnswer;
import ch.ge.social.qeli.service.api.answer.dto.OptionAnswer;
import ch.ge.social.qeli.service.api.answer.dto.QuestionOption;
import ch.ge.social.qeli.service.api.answer.dto.StringAnswer;
import ch.ge.social.qeli.service.api.answer.dto.TauxAnswer;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

class ToAnswerValueVisitor implements AnswerVisitor<List<AnswerValue>> {
  public static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("dd-MM-YYYY");

  private final String key;

  public ToAnswerValueVisitor(String key) {
    this.key = key;
  }

  @Override
  public List<AnswerValue> visitCheckboxGroupAnswer(CheckboxGroupAnswer answer) {
    if (answer.isInconnuSelected()) {
      return Collections.singletonList(new AnswerValue(key, "INCONNU"));
    } else if (answer.isNonSelected()) {
      return Collections.singletonList(new AnswerValue(key, "AUCUN"));
    } else {
      return Optional.ofNullable(answer.getChoices())
                     .map(choices -> choices.stream()
                                            .map(choice -> new AnswerValue(key, choice.getValue()))
                                            .collect(Collectors.toList())
                     ).orElse(Collections.emptyList());
    }
  }

  @Override
  public List<AnswerValue> visitDateAnswer(DateAnswer answer) {
    return Optional.ofNullable(answer.getValue())
                   .map(date -> Collections.singletonList(new AnswerValue(key, date.format(FORMATTER))))
                   .orElse(Collections.emptyList());
  }

  @Override
  public List<AnswerValue> visitDropdownAnswer(DropdownAnswer answer) {
    if (answer.isInconnuSelected()) {
      return Collections.singletonList(new AnswerValue(key, "INCONNU"));
    } else {
      return Optional.ofNullable(answer.getValue())
                     .map(QuestionOption::getValue)
                     .map(value -> Collections.singletonList(new AnswerValue(key, value.toString())))
                     .orElse(Collections.emptyList());
    }
  }

  @Override
  public List<AnswerValue> visitOptionAnswer(OptionAnswer<?> answer) {
    return Optional.ofNullable(answer.getValue())
                   .map(QuestionOption::getValue)
                   .map(value -> Collections.singletonList(new AnswerValue(key, value.toString())))
                   .orElse(Collections.emptyList());
  }

  @Override
  public List<AnswerValue> visitNationaliteAnswer(NationaliteAnswer answer) {
    if (answer.isApatride()) {
      return Collections.singletonList(new AnswerValue(key, "APATRIDE"));
    }

    return Optional.ofNullable(answer.getPays())
                   .map(paysList -> paysList.stream()
                                            .map(pays -> new AnswerValue(key, pays.getValue()))
                                            .collect(Collectors.toList()))
                   .orElse(Collections.emptyList());
  }

  @Override
  public List<AnswerValue> visitNumberAnswer(NumberAnswer answer) {
    return Optional.ofNullable(answer.getValue())
                   .map(value -> Collections.singletonList(new AnswerValue(key, value.toString())))
                   .orElse(Collections.emptyList());
  }

  @Override
  public List<AnswerValue> visitTauxAnswer(TauxAnswer answer) {
    return Optional.ofNullable(answer.getValue())
                   .map(value -> Collections.singletonList(new AnswerValue(key, value.toString())))
                   .orElse(Collections.emptyList());
  }

  @Override
  public List<AnswerValue> visitTextAnswer(StringAnswer answer) {
    return Optional.ofNullable(answer.getValue())
                   .map(value -> Collections.singletonList(new AnswerValue(key, value)))
                   .orElse(Collections.emptyList());
  }

  @Override
  public List<AnswerValue> visitCompositeAnswer(CompositeAnswer answer) throws InvalidAnswerFormatException {
    return Optional
      .ofNullable(answer.getAnswers())
      .map(answers -> answers.entrySet()
                             .stream()
                             .map(entry -> {
                               Answer subanswer = entry.getValue();
                               return subanswer.accept(new ToAnswerValueVisitor(this.key + "." + entry.getKey()));
                             })
                             .flatMap(List::stream)
                             .collect(Collectors.toList()))
      .orElse(Collections.emptyList());
  }

}
