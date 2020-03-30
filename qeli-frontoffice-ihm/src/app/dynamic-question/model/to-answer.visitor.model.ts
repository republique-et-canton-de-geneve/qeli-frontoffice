import { Answer, NumberAnswer, StringAnswer } from './answer.model';
import {
  CheckboxGroupAnswer, CheckboxGroupAnswerSchema, CheckboxGroupQuestion
} from '../checkbox-group-question/checkbox-group-question.model';
import { DateAnswer, DateAnswerSchema, DateQuestion } from '../date-question/date-question.model';
import { DropdownQuestion } from '../dropdown-question/dropdown-question.model';
import {
  NationaliteAnswer, NationaliteAnswerSchema, NationaliteQuestion
} from '../nationalite-question/nationalite-question.model';
import {
  NumberGroupAnswer, NumberGroupAnswerSchema, NumberGroupQuestion
} from '../number-group-question/number-group-question.model';
import { NumberQuestion } from '../number-question/number-question.model';
import { RadioQuestion } from '../radio-question/radio-question.model';
import { TauxQuestion } from '../taux-question/taux-question.model';
import { TextQuestion } from '../text-question/text-question.model';
import { QuestionVisitorModel } from './question-visitor.model';

/**
 * Un visiteur qui permet la création d'un objet réponse compte tenu de la question et des données brutes extraites
 * d'un champ de formulaire.
 */
export class ToAnswerVisitor implements QuestionVisitorModel<Answer> {
  rawAnswer: any;

  constructor(rawAnswer: any) {
    this.rawAnswer = rawAnswer;
  }

  visitCheckboxGroupQuestion(question: CheckboxGroupQuestion): Answer {
    const listOfOptions = question.listOfOptions;
    const choices = this.rawAnswer['choices'] as string[];
    const none = this.rawAnswer['none'] as 'OUI' | 'NON' | 'INCONNU';

    return new CheckboxGroupAnswer({
      none: question.findNoneOptionByKey(none),
      choices: choices.map(choice => listOfOptions.find(option => option.value === choice))
    });
  }

  visitDateQuestion(question: DateQuestion): Answer {
    return new DateAnswer(this.rawAnswer);
  }

  visitDropdownQuestion(question: DropdownQuestion): Answer {
    return new StringAnswer(this.rawAnswer);
  }

  visitNationaliteQuestion(question: NationaliteQuestion): Answer {
    return new NationaliteAnswer(this.rawAnswer);
  }

  visitNumberGroupQuestion(question: NumberGroupQuestion): Answer {
    return new NumberGroupAnswer(this.rawAnswer);
  }

  visitNumberQuestion(question: NumberQuestion): Answer {
    return new NumberAnswer(this.rawAnswer);
  }

  visitRadioQuestion(question: RadioQuestion): Answer {
    return new StringAnswer(this.rawAnswer);
  }

  visitTauxQuestion(question: TauxQuestion): Answer {
    return new NumberAnswer(this.rawAnswer['taux']);
  }

  visitTextQuestion(question: TextQuestion): Answer {
    return new StringAnswer(this.rawAnswer);
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
    return new StringAnswer(this.schemaAnswer as string);
  }

  visitNationaliteQuestion(question: NationaliteQuestion): Answer {
    return new NationaliteAnswer(this.schemaAnswer as NationaliteAnswerSchema);
  }

  visitNumberGroupQuestion(question: NumberGroupQuestion): Answer {
    return new NumberGroupAnswer(this.schemaAnswer as NumberGroupAnswerSchema);
  }

  visitNumberQuestion(question: NumberQuestion): Answer {
    return new NumberAnswer(this.schemaAnswer as number);
  }

  visitRadioQuestion(question: RadioQuestion): Answer {
    return new StringAnswer(this.schemaAnswer as string);
  }

  visitTauxQuestion(question: TauxQuestion): Answer {
    return new NumberAnswer(this.schemaAnswer as number);
  }

  visitTextQuestion(question: TextQuestion): Answer {
    return new StringAnswer(this.schemaAnswer as string);
  }
}
