import { CheckboxGroupAnswer } from '../checkbox-group-question/checkbox-group-question.model';
import { DateAnswer } from '../date-question/date-question.model';
import { NationaliteAnswer } from '../nationalite-question/nationalite-question.model';
import { TranslateService } from '@ngx-translate/core';
import { QuestionOption } from './quesiton.model';
import { AnswerVisitor } from './answer-visitor.model';
import { NumberAnswer, OptionAnswer, StringAnswer } from './answer.model';
import { CompositeAnswer } from '../composite-question/composite-question.model';

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
    return undefined;
  }

  visitNationaliteAnswer(answer: NationaliteAnswer): string {
    return undefined;
  }

  visitNumberAnswer(answer: NumberAnswer): string {
    return answer.value.toString();
  }

  visitStringAnswer(answer: StringAnswer): string {
    return answer.value;
  }

  visitOptionAnswer<E>(answer: OptionAnswer<E>): string {
    return this.translateOption(answer.option);
  }

  visitCompositeAnswer(answer: CompositeAnswer): string {
    return Object.values(answer.answers).map(answer => answer.accept(this)).join(', ');
  }

}
