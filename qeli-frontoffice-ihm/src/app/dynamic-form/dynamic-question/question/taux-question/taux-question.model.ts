import { QuestionBase } from '../question-base.model';
import { QuestionVisitor } from '../question-visitor';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

export class TauxQuestion extends QuestionBase<number> {
  controlType = 'taux';

  constructor(options: {} = {}) {
    super(options);
  }

  protected requiredValidator(): ValidatorFn {
    return TauxQuestionValidators.required;
  }

  accept<E>(visitor: QuestionVisitor<E>): E {
    return visitor.visitTauxQuestion(this);
  }

  toFormControl(defaultValue: any): AbstractControl {
    let group: any = {};

    group['taux'] = new FormControl(
      defaultValue && defaultValue['taux'] ? defaultValue['taux'] : null,
      [Validators.max(100), Validators.min(0), Validators.pattern(/-?\d+(,\d+)?/)]
    );
    group['other'] = new FormControl(defaultValue ? defaultValue['other'] : false);

    return new FormGroup(group, this.validators);
  }
}

export class TauxQuestionValidators {
  static required(control: AbstractControl) {
    if (control && control.value) {
      return control.value['taux'] === null || control.value['taux'] === undefined ? {'required': true} : null;
    }

    return null;
  }
}

