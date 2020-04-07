import { QuestionVisitorModel } from '../model/question-visitor.model';
import { AbstractControl, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { Question, QuestionSchema } from '../model/question.model';
import { NumberAnswer } from '../model/answer.model';

export const NUMBER_GROUP_TYPE = 'number';

export interface NumberQuestionSchema extends QuestionSchema {
  placeholder?: number;
  min?: number;
  max?: number;
  showDecimals?: boolean;
}

export class NumberQuestion extends Question<NumberAnswer> {
  controlType = NUMBER_GROUP_TYPE;
  placeholder: number;
  min: number;
  max: number;
  showDecimals: boolean;

  constructor(options: NumberQuestionSchema) {
    super(options);
    this.min = options.min;
    this.max = options.max;
    this.showDecimals = !!options.showDecimals;
    this.placeholder = options.placeholder;
  }

  toFormControl(defaultValue: NumberAnswer): AbstractControl {
    let numberValidators: ValidatorFn[] = [];

    if (this.showDecimals) {
      numberValidators.push(Validators.pattern(/-?\d+(,\d+)?/));
    } else {
      numberValidators.push(Validators.pattern(/-?\d+/));
    }

    if (this.max !== null && this.max !== undefined) {
      numberValidators.push(Validators.max(this.max));
    }

    if (this.min !== null && this.min !== undefined) {
      numberValidators.push(Validators.min(this.min));
    }

    return new FormControl(defaultValue ? defaultValue.value : null, this.validators.concat(numberValidators));
  }

  accept<E>(visitor: QuestionVisitorModel<E>): E {
    return visitor.visitNumberQuestion(this);
  }
}
