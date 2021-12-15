/*
 * qeli-frontoffice
 *
 * Copyright (C) 2019-2021 Republique et canton de Geneve
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
