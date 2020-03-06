import { QuestionBase } from '../question-base.model';
import { QuestionVisitor } from '../question-visitor';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

export class NumberGroupQuestion extends QuestionBase<any> {
  controlType = 'number-group-question';
  hasNone: boolean;
  fields: NumberField[];

  constructor(options: {} = {}) {
    super(options);
    this.hasNone = !!options['hasNone'];
    this.fields = options['fields'] || [];
  }

  toFormControl(defaultValue: any): AbstractControl {
    let group: any = {};

    group['values'] = new FormGroup(
      this.fields.map(field => {
        let value = {};

        value[field.label] = new FormControl(
          defaultValue && defaultValue['values'] ? defaultValue['values'][field.label] : null,
          field.toValidators()
        );

        return value;
      }).reduce((r, c) => Object.assign(r, c), {})
    );

    if (this.hasNone) {
      group['none'] = new FormControl(defaultValue ? defaultValue['none'] : false);
    }

    return new FormGroup(group, this.validators);
  }

  accept<E>(visitor: QuestionVisitor<E>): E {
    return visitor.visitNumberGroupQuestion(this);
  }
}

export class NumberField {
  label: string;
  max: number;
  min: number;
  required: boolean;

  constructor(options: {
    label?: string,
    max?: number,
    min?: number,
    required?: boolean;
  } = {}) {
    this.label = options.label;
    this.max = options.max;
    this.min = options.min;
    this.required = !!options.required;
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

export class NumberGroupQuestionValidators {
  static atLeastOneFilled(options: string[], hasNone: boolean = false) {
    return (control: AbstractControl) => {
      if (control && control.value) {
        const atLeastOneOption = options.some(option => {
          const value = control.value['values'][option];
          return value !== null && value !== undefined;
        });
        const isNoneSelected = hasNone && !!control.value['none'];

        return !atLeastOneOption && !isNoneSelected ? {'atLeastOneFilled': true} : null
      }

      return null;
    }
  }
}
