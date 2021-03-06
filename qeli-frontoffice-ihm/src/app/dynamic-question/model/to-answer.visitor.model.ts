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

import { Answer, NumberAnswer, OptionAnswer, SimpleAnswerSchema, StringAnswer } from './answer.model';
import {
  CheckboxGroupAnswer, CheckboxGroupAnswerSchema, CheckboxGroupQuestion
} from '../checkbox-group-question/checkbox-group-question.model';
import { DateAnswer, DateAnswerSchema, DateQuestion } from '../date-question/date-question.model';
import { DropdownAnswer, DropdownAnswerSchema, DropdownQuestion } from '../dropdown-question/dropdown-question.model';
import {
  NationaliteAnswer, NationaliteAnswerSchema, NationaliteQuestion
} from '../nationalite-question/nationalite-question.model';
import { NumberQuestion } from '../number-question/number-question.model';
import { RadioQuestion } from '../radio-question/radio-question.model';
import { TauxAnswer, TauxAnswerSchema, TauxQuestion } from '../taux-question/taux-question.model';
import { TextQuestion } from '../text-question/text-question.model';
import { QuestionVisitorModel } from './question-visitor.model';
import { CompositeAnswer, CompositeQuestion } from '../composite-question/composite-question.model';
import { QuestionOption } from './question.model';

/**
 * Un visiteur qui permet la création d'un objet réponse compte tenu de la question et des données brutes extraites
 * d'un champ de formulaire.
 */
export class ToAnswerVisitor implements QuestionVisitorModel<Answer> {
  rawAnswers: any;
  questionKey: string;

  constructor(rawAnswers: any, questionKey: string) {
    this.rawAnswers = rawAnswers;
    this.questionKey = questionKey;
  }

  get rawAnswer() {
    return this.rawAnswers[this.questionKey];
  }

  visitCheckboxGroupQuestion(question: CheckboxGroupQuestion): Answer {
    const listOfOptions = question.listOfOptions;
    const choices = this.rawAnswer['choices'] as string[];
    const none = this.rawAnswer['hasSome'] as 'OUI' | 'NON' | 'INCONNU';

    return new CheckboxGroupAnswer({
      hasSome: question.findHasSomeOptionByKey(none),
      choices: choices.map(choice => listOfOptions.find(option => option.value === choice))
    });
  }

  visitDateQuestion(question: DateQuestion): Answer {
    const value = this.rawAnswer['value'] as Date;
    const shortcut = this.rawAnswer['shortcut'] as 'NO_SHORTCUT' | string;

    return new DateAnswer({
      shortcut: shortcut ? question.findShortcutByValue(shortcut) : null,
      value: value
    });
  }

  visitDropdownQuestion(question: DropdownQuestion): Answer {
    const value = this.rawAnswer['value'] as string;
    const someOption = this.rawAnswer['hasSome'] as 'OUI' | 'INCONNU';

    return new DropdownAnswer({
      value: question.dropdownOptions.find(option => option.value === value),
      hasSome: question.findHasSomeOptionByKey(someOption)
    });
  }

  visitNationaliteQuestion(question: NationaliteQuestion): Answer {
    const pays = this.rawAnswer['pays'] as string[];
    const apatride = this.rawAnswer['apatride'] as boolean;

    return new NationaliteAnswer({
      pays: !apatride && pays ? pays.filter(item => item !== null && item !== undefined)
                                    .map(value => question.paysOptions.find(option => option.value === value)) : [],
      apatride: apatride
    });
  }

  visitNumberQuestion(question: NumberQuestion): Answer {
    return new NumberAnswer({value: parseFloat(this.rawAnswer)});
  }

  visitRadioQuestion(question: RadioQuestion): Answer {
    const value = question.radioOptions.find(option => option.value === this.rawAnswer);
    return new OptionAnswer({value: value});
  }

  visitTauxQuestion(question: TauxQuestion): Answer {
    return new TauxAnswer({
      value: parseInt(this.rawAnswer['value']),
      isHourly: this.rawAnswer['isHourly'] as boolean,
      workingHoursByWeek: question.workingHoursByWeek
    });
  }

  visitTextQuestion(question: TextQuestion): Answer {
    return new StringAnswer({value: this.rawAnswer as string});
  }

  visitCompositeQuestion(question: CompositeQuestion): Answer {
    let result: { [key: string]: Answer } = {};
    question.items.filter(
      component => !component.isShown || component.isShown(this.rawAnswers)
    ).forEach(component => {
      result[component.question.key] = component.question.accept(
        new ToAnswerVisitor(this.rawAnswer, component.question.key)
      );
    });

    return new CompositeAnswer({answers: result});
  }
}

export class FromSchemaToAnswerVisitor implements QuestionVisitorModel<Answer> {
  schemaAnswer: any;

  constructor(schemaAnswer: any) {
    this.schemaAnswer = schemaAnswer;
  }

  visitCheckboxGroupQuestion(question: CheckboxGroupQuestion): Answer {
    return new CheckboxGroupAnswer(this.schemaAnswer as CheckboxGroupAnswerSchema);
  }

  visitDateQuestion(question: DateQuestion): Answer {
    return new DateAnswer(this.schemaAnswer as DateAnswerSchema);
  }

  visitDropdownQuestion(question: DropdownQuestion): Answer {
    return new DropdownAnswer(this.schemaAnswer as DropdownAnswerSchema);
  }

  visitNationaliteQuestion(question: NationaliteQuestion): Answer {
    return new NationaliteAnswer(this.schemaAnswer as NationaliteAnswerSchema);
  }

  visitNumberQuestion(question: NumberQuestion): Answer {
    return new NumberAnswer(this.schemaAnswer as SimpleAnswerSchema<number>);
  }

  visitRadioQuestion(question: RadioQuestion): Answer {
    return new OptionAnswer(this.schemaAnswer as SimpleAnswerSchema<QuestionOption<string>>);
  }

  visitTauxQuestion(question: TauxQuestion): Answer {
    return new TauxAnswer(this.schemaAnswer as TauxAnswerSchema);
  }

  visitTextQuestion(question: TextQuestion): Answer {
    return new StringAnswer(this.schemaAnswer as SimpleAnswerSchema<string>);
  }

  visitCompositeQuestion(question: CompositeQuestion): Answer {
    let result: { [key: string]: Answer } = {};
    const schemaAnswers = this.schemaAnswer['answers'];
    question.items.forEach(component => {
      const childSchemaAnswer = schemaAnswers[component.question.key];
      if (childSchemaAnswer !== null && childSchemaAnswer !== undefined) {
        result[component.question.key] = component.question.accept(
          new FromSchemaToAnswerVisitor(childSchemaAnswer)
        );
      }
    });

    return new CompositeAnswer({answers: result});
  }
}
