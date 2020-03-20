import { QuestionBase } from '../question-base.model';
import { QuestionVisitor } from '../question-visitor';
import { Validators } from '@angular/forms';

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

    this.validators.push(Validators.pattern(this.showDecimals ? /-?\d+(,\d+)?/ : /-?\d+/));

    if (this.max !== null && this.max !== undefined) {
      this.validators.push(Validators.max(this.max));
    }

    if (this.min !== null && this.min !== undefined) {
      this.validators.push(Validators.min(this.min));
    }
  }

  accept<E>(visitor: QuestionVisitor<E>): E {
    return visitor.visitNumberQuestion(this);
  }
}
