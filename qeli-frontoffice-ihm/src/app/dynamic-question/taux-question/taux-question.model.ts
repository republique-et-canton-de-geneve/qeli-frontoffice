import { QuestionVisitorModel } from '../model/question-visitor.model';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Question, QuestionSchema } from '../model/quesiton.model';
import { NumberAnswer } from '../model/answer.model';

export const TAUX_CONTROL_TYPE = 'taux';

export class TauxQuestion extends Question<NumberAnswer> {
  controlType = TAUX_CONTROL_TYPE;

  constructor(options: QuestionSchema) {
    super(options);
  }

  protected requiredValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      if (control && control.value) {
        return control.value['taux'] === null || control.value['taux'] === undefined ? {'required': true} : null;
      }

      return null;
    };
  }

  accept<E>(visitor: QuestionVisitorModel<E>): E {
    return visitor.visitTauxQuestion(this);
  }

  toFormControl(defaultValue: NumberAnswer): AbstractControl {
    let group: any = {};

    group['taux'] = new FormControl(
      defaultValue ? defaultValue.value : null,
      [Validators.max(100), Validators.min(0), Validators.pattern(/-?\d+(,\d+)?/)]
    );
    group['other'] = new FormControl(defaultValue ? defaultValue['other'] : false);

    return new FormGroup(group, this.validators);
  }
}
