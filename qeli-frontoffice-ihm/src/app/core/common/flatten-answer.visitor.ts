import { QuestionVisitor } from '../question/question-visitor';
import { QuestionBase } from '../question/question-base.model';
import { CheckboxGroupQuestion } from '../question/checkbox-group-question/checkbox-group-question.model';
import { ReponseProgressive } from './reponse.model';
import { DateQuestion } from '../question/date-question/date-question.model';
import { DropdownQuestion } from '../question/dropdown-question/dropdown-question.model';
import { NationaliteQuestion } from '../question/nationalite-question/nationalite-question.model';
import { NumberQuestion } from '../question/number-question/number-question.model';
import { RadioQuestion } from '../question/radio-question/radio-question.model';
import { TauxQuestion } from '../question/taux-question/taux-question.model';
import { TextQuestion } from '../question/text-question/text-question.model';
import { NumberGroupQuestion } from '../question/number-group-question/number-group-question.model';
import { Injectable } from '@angular/core';


@Injectable()
export class FlattenAnswerVisitorFactory {

  constructor() {}

  create(data: any) {
    return new FlattenAnswerVisitor(data);
  }
}

class FlattenAnswerVisitor implements QuestionVisitor<string[]> {

  constructor(private data: any) {

  }

  private findValueForQuestion(question: QuestionBase<any>): any {
    return this.data[question.key];
  }

  visitCheckboxGroupQuestion(question: CheckboxGroupQuestion): string[] {
    const answer = this.findValueForQuestion(question);
    let result = [];

    if (answer['none'] !== ReponseProgressive.NON) {
      result.push(answer['none'] === ReponseProgressive.OUI ? 'AUCUNE' : 'INCONNU');
    }
    answer['choices'].forEach(value => {
      result.push(value);
    });

    return result;
  }

  visitDateQuestion(question: DateQuestion): string[] {
    const answer = this.findValueForQuestion(question);

    if (answer['shortcut'] && answer['shortcut'] !== 'NO_SHORTCUT') {
      return [answer['shortcut']];
    }

    return answer['value'] ? [answer['value']] : [];
  }

  visitDropdownQuestion(question: DropdownQuestion): string[] {
    const answer = this.findValueForQuestion(question);
    return answer ? [answer] : [];
  }

  visitNationaliteQuestion(question: NationaliteQuestion): string[] {
    const value = this.findValueForQuestion(question);

    if (!!value['apatride']) {
      return ['APATRIDE'];
    }
    return value['pays'].filter(x => x != null);
  }

  visitNumberQuestion(question: NumberQuestion): string[] {
    const answer = this.findValueForQuestion(question);
    return answer ? [answer] : [];
  }

  visitRadioQuestion(question: RadioQuestion): string[] {
    const answer = this.findValueForQuestion(question);
    return answer ? [answer] : [];
  }

  visitTauxQuestion(question: TauxQuestion): string[] {
    const value = this.findValueForQuestion(question);
    return [value['taux']];
  }

  visitTextQuestion(question: TextQuestion): string[] {
    const answer = this.findValueForQuestion(question);
    return answer ? [answer] : [];
  }

  visitNumberGroupQuestion(question: NumberGroupQuestion): string[] {
    const answer = this.findValueForQuestion(question);

    if (!!answer['none']) {
      return ['AUCUN'];
    }

    return Object.entries(answer['values']).map(entry => {
      return `${entry[0]}=${entry[1]}`
    });
  }

}
