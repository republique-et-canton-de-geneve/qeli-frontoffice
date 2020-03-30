import { QuestionVisitorModel } from '../model/question-visitor.model';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Question, QuestionSchema } from '../model/quesiton.model';
import { Answer } from '../model/answer.model';
import { AnswerVisitor } from '../model/answer-visitor.model';
import { I18nString } from '../../core/i18n/i18nstring.model';

export const NUMBER_GROUP_CONTROL_TYPE = 'number-group';

export interface NumberGroupAnswerSchema {
  values?: { [key: string]: number };
  none?: boolean;
}

export class NumberGroupAnswer extends Answer {
  values: { [key: string]: number };
  none: boolean;

  constructor(options: NumberGroupAnswerSchema) {
    super();
    this.values = options.values || {};
    this.none = !!options.none;
  }

  accept<E>(visitor: AnswerVisitor<E>): E {
    return undefined;
  }
}

export interface NumberGroupQuestionSchema extends QuestionSchema {
  hasNone?: boolean;
  fields: NumberField[];
}

export class NumberGroupQuestion extends Question<NumberGroupAnswer> {
  controlType = NUMBER_GROUP_CONTROL_TYPE;
  hasNone: boolean;
  fields: NumberField[];

  constructor(options: NumberGroupQuestionSchema) {
    super(options);
    this.hasNone = !!options.hasNone;
    this.fields = options.fields || [];
  }

  protected requiredValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      if (control && control.value) {
        const atLeastOneOption = this.fields.map(field => field.key).some(option => {
          const value = control.value['values'][option];
          return value !== null && value !== undefined;
        });
        const isNoneSelected = this.hasNone && !!control.value['none'];

        return !atLeastOneOption && !isNoneSelected ? {'atLeastOneFilled': true} : null
      }

      return null;
    };
  }

  toFormControl(defaultValue: NumberGroupAnswer): AbstractControl {
    let group: any = {};

    group['values'] = new FormGroup(
      this.fields.map(field => {
        let value = {};

        value[field.key] = new FormControl(
          defaultValue && defaultValue.values ? defaultValue.values[field.key] : null,
          field.toValidators()
        );

        return value;
      }).reduce((r, c) => Object.assign(r, c), {})
    );

    if (this.hasNone) {
      group['none'] = new FormControl(defaultValue ? defaultValue.none : false);
    }

    return new FormGroup(group, this.validators);
  }

  accept<E>(visitor: QuestionVisitorModel<E>): E {
    return visitor.visitNumberGroupQuestion(this);
  }
}

export class NumberField {
  key: string;
  label: I18nString;
  max: number;
  min: number;
  required: boolean;

  constructor(key: string, label: I18nString, max?: number, min?: number, required?: boolean) {
    this.key = key;
    this.label = label;
    this.max = max;
    this.min = min;
    this.required = required;
  }

  toValidators() {
    let validators = [Validators.pattern(/-?\d+/)];

    if (this.max !== null && this.max !== undefined) {
      validators.push(Validators.max(this.max));
    }

    if (this.min !== null && this.min !== undefined) {
      validators.push(Validators.min(this.min));
    }

    if (this.required) {
      validators.push(Validators.required);
    }

    return validators;
  }
}
