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
