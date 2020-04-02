import { QuestionVisitorModel } from '../model/question-visitor.model';
import { AbstractControl, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { DateValidators } from '../../ge-forms/date.validators';
import { Answer } from '../model/answer.model';
import { AnswerVisitor } from '../model/answer-visitor.model';
import { Question, QuestionOption, QuestionSchema } from '../model/quesiton.model';

export const DATE_CONTROL_TYPE = 'date';

export interface DateAnswerSchema {
  shortcut?: 'NO_SHORTCUT' | string;
  value: string;
}

export class DateAnswer extends Answer {
  shortcut: 'NO_SHORTCUT' | string;
  value: string;

  constructor(options: DateAnswerSchema) {
    super();
    this.shortcut = options.shortcut || 'NO_SHORTCUT';
    this.value = options.value;
  }

  accept<E>(visitor: AnswerVisitor<E>): E {
    return visitor.visitDateAnswer(this);
  }
}

export interface DateQuestionSchema extends QuestionSchema {
  shortcuts?: QuestionOption<string>[];
  maxDate?: Date;
  minDate?: Date;
}

export class DateQuestion extends Question<DateAnswer> {
  controlType = DATE_CONTROL_TYPE;
  maxDate: Date;
  minDate: Date;
  shortcuts: QuestionOption<string>[];

  constructor(options: DateQuestionSchema) {
    super(options);

    this.shortcuts = options.shortcuts ? options.shortcuts : [];
    this.minDate = options.minDate ? options.minDate : null;
    this.maxDate = options.maxDate ? options.maxDate : null;
  }

  protected requiredValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      if (control && control.value) {
        const isDateFilled = !!control.value['value'];
        const isShortcutSelected = this.shortcuts.length > 0 &&
                                   control.value['shortcut'] &&
                                   control.value['shortcut'] !== 'NO_SHORTCUT';

        return !isDateFilled && !isShortcutSelected ? {'required': true} : null;
      }

      return null;
    };
  }

  toFormControl(defaultValue: DateAnswer): AbstractControl {
    let group: any = {};

    if (this.shortcuts && this.shortcuts.length > 0) {
      group['shortcut'] = new FormControl(defaultValue ? defaultValue.shortcut : null);
    }

    let dateValidators: ValidatorFn[] = [];

    if (this.maxDate) {
      dateValidators.push(DateValidators.maxDate(this.maxDate));
    }

    if (this.minDate) {
      dateValidators.push(DateValidators.minDate(this.minDate));
    }

    dateValidators.push(DateValidators.date);

    group['value'] = new FormControl(
      defaultValue && defaultValue.value ? defaultValue.value : null,
      dateValidators
    );

    return new FormGroup(group, this.validators);
  }

  accept<E>(visitor: QuestionVisitorModel<E>): E {
    return visitor.visitDateQuestion(this);
  }
}