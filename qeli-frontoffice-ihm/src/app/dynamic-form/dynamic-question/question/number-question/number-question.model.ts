import { QuestionBase } from '../question-base.model';
import { QuestionVisitor } from '../question-visitor';
import { AbstractControl, FormControl, Validators } from '@angular/forms';

export class NumberQuestion extends QuestionBase<number> {
  controlType = 'number';
  placeholder: number;
  min: number;
  max: number;
  showDecimals: boolean;

  constructor(options: {} = {}) {
    super(options);
    this.min = options['min'];
    this.max = options['max'];
    this.showDecimals = !!options['showDecimals'];
    this.placeholder = options['placeholder'] || '';
  }

  toFormControl(defaultValue: number): AbstractControl {
    const validators = this.validators;
    validators.push(Validators.pattern(this.showDecimals ? /-?\d+(,\d+)?/ : /-?\d+/));

    if (this.max !== null && this.max !== undefined) {
      validators.push(Validators.max(this.max));
    }

    if (this.min !== null && this.min !== undefined) {
      validators.push(Validators.min(this.min));
    }
    return new FormControl(defaultValue, validators);
  }

  accept<E>(visitor: QuestionVisitor<E>): E {
    return visitor.visitNumberQuestion(this);
  }
}
