import { QuestionBase } from '../question-base.model';
import { QuestionVisitor } from '../question-visitor';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

export class TauxQuestion extends QuestionBase<number> {
  controlType = 'taux';

  constructor(options: {} = {}) {
    super(options);
  }

  accept<E>(visitor: QuestionVisitor<E>): E {
    return visitor.visitTauxQuestion(this);
  }

  toFormControl(defaultValue: any): AbstractControl {
    let group: any = {};

    group['taux'] = new FormControl(
      defaultValue && defaultValue['taux'] ? defaultValue['taux'] : null,
      [Validators.max(100),Validators.min(0), Validators.pattern(/-?\d+(,\d+)?/)]
    );
    group['other'] = new FormControl(defaultValue ? defaultValue['other'] : false);

    return new FormGroup(group, this.validators);
  }
}
