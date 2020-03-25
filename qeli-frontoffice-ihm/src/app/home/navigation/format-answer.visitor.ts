import { QuestionVisitor } from '../../dynamic-form/dynamic-question/question/question-visitor';
import { QuestionBase } from '../../dynamic-form/dynamic-question/question/question-base.model';
import { CheckboxGroupQuestion } from '../../dynamic-form/dynamic-question/question/checkbox-group-question/checkbox-group-question.model';
import { DateQuestion } from '../../dynamic-form/dynamic-question/question/date-question/date-question.model';
import { DropdownQuestion } from '../../dynamic-form/dynamic-question/question/dropdown-question/dropdown-question.model';
import { NationaliteQuestion } from '../../dynamic-form/dynamic-question/question/nationalite-question/nationalite-question.model';
import { RadioQuestion } from '../../dynamic-form/dynamic-question/question/radio-question/radio-question.model';
import { TextQuestion } from '../../dynamic-form/dynamic-question/question/text-question/text-question.model';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { QuestionOption } from '../../dynamic-form/dynamic-question/question/option.model';
import { ReponseProgressive } from '../../dynamic-form/model/reponse.model';
import { NumberGroupQuestion } from '../../dynamic-form/dynamic-question/question/number-group-question/number-group-question.model';
import * as moment from 'moment';
import { NumberQuestion } from '../../dynamic-form/dynamic-question/question/number-question/number-question.model';
import { TauxQuestion } from '../../dynamic-form/dynamic-question/question/taux-question/taux-question.model';

@Injectable()
export class FormatAnswerVisitorFactory {

  constructor(private translate: TranslateService) {

  }

  create(data: any) {
    return new FormatAnswerVisitor(data, this.translate);
  }
}

export class FormatAnswerVisitor implements QuestionVisitor<string> {

  constructor(private data: any,
              private translate: TranslateService) {

  }

  private findValueForQuestion(question: QuestionBase<any>): any {
    return this.data[question.key];
  }

  private translateOption(questionKey: string, options: QuestionOption[], answer: string) {
    const selectedOption = options.find(option => option.label === answer);
    return this.translate.instant(
      `question.${questionKey}.option.${selectedOption.label}${selectedOption.help ? '.label' : ''}`
    );
  }

  visitCheckboxGroupQuestion(question: CheckboxGroupQuestion): string {
    const answer = this.findValueForQuestion(question);

    if (answer['none'] !== ReponseProgressive.NON) {
      return this.translate.instant(
        `question.${question.key}.${answer['none'] === ReponseProgressive.OUI ? 'none' : 'inconnu'}`
      );
    }

    return answer['choices'].map(
      choice => this.translateOption(question.key, question.listOfOptions, choice)
    ).join(', ');
  }

  visitDateQuestion(question: DateQuestion): string {
    const answer = this.findValueForQuestion(question);

    if (answer['shortcut'] && answer['shortcut'] !== 'NO_SHORTCUT') {
      return this.translate.instant(`question.${question.key}.shortcut.${answer['shortcut']}`);
    }

    return moment(answer['value'], 'YYYY-MM-DD', true).format('DD.MM.YYYY');
  }

  visitDropdownQuestion(question: DropdownQuestion): string {
    return this.translate.instant(
      `question.${question.key}.option.${this.findValueForQuestion(question)}`
    );
  }

  visitNationaliteQuestion(question: NationaliteQuestion): string {
    const answer = this.findValueForQuestion(question);

    if (!!answer['apatride']) {
      return this.translate.instant(`question.${question.key}.apatride.label`);
    }

    return answer['pays'].map(
      pays => this.translate.instant(`common.pays.${pays}`)
    ).join(', ');
  }

  visitNumberQuestion(question: NumberQuestion): string {
    return this.findValueForQuestion(question);
  }

  visitRadioQuestion(question: RadioQuestion): string {
    return this.translateOption(
      question.key, question.options, this.findValueForQuestion(question)
    );
  }

  visitTauxQuestion(question: TauxQuestion): string {
    const answer = this.findValueForQuestion(question);
    return `${answer['taux']}%`;
  }

  visitTextQuestion(question: TextQuestion): string {
    return this.findValueForQuestion(question);
  }

  visitNumberGroupQuestion(question: NumberGroupQuestion): string {
    const answer = this.findValueForQuestion(question);

    if (!!answer['none']) {
      return this.translate.instant(`question.${question.key}.none`);
    }

    return Object.entries(answer['values']).map(entry => {
      const label = this.translate.instant(`question.${question.key}.field.${entry[0]}`);
      return `${entry[1]} ${label}`
    }).join(', ');
  }

}
