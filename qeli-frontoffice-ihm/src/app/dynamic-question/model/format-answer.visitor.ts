import { CheckboxGroupAnswer } from '../checkbox-group-question/checkbox-group-question.model';
import { DateAnswer } from '../date-question/date-question.model';
import { NationaliteAnswer } from '../nationalite-question/nationalite-question.model';
import { TranslateService } from '@ngx-translate/core';
import { QuestionOption } from './question.model';
import { AnswerVisitor } from './answer-visitor.model';
import { NumberAnswer, OptionAnswer, StringAnswer } from './answer.model';
import { CompositeAnswer } from '../composite-question/composite-question.model';
import * as moment from 'moment';

export class FormatAnswerVisitor implements AnswerVisitor<string> {
  constructor(private translate: TranslateService) {
  }

  private translateOption<T>(option: QuestionOption<T>) {
    return this.translate.instant(option.label.key, option.label.parameters);
  }

  visitCheckboxGroupAnswer(answer: CheckboxGroupAnswer): string {
    if (!answer.none || answer.none.value === 'NON') {
      return answer.choices.map(choice => this.translateOption(choice)).join(', ');
    } else {
      return this.translateOption(answer.none);
    }
  }

  visitDateAnswer(answer: DateAnswer): string {
    if (answer.shortcut && answer.shortcut.value === 'NO_SHORTCUT') {
      return moment(answer.value).format('DD.MM.YYYY');
    } else {
      return this.translateOption(answer.shortcut);
    }
  }

  visitNationaliteAnswer(answer: NationaliteAnswer): string {
    if (!answer.apatride) {
      return answer.pays.map(option => this.translateOption(option)).join(', ');
    } else {
      return this.translate.instant('common.apatride.label');
    }
  }

  visitNumberAnswer(answer: NumberAnswer): string {
    return answer.value.toString();
  }

  visitStringAnswer(answer: StringAnswer): string {
    return answer.value;
  }

  visitOptionAnswer<E>(answer: OptionAnswer<E>): string {
    return this.translateOption(answer.value);
  }

  visitCompositeAnswer(answer: CompositeAnswer): string {
    return Object.values(answer.answers).map(answer => answer.accept(this)).join(', ');
  }
}
