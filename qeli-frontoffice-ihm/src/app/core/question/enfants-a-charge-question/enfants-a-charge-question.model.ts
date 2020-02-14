import { QuestionBase } from '../question-base.model';
import { QuestionVisitor } from '../question-visitor';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

export class EnfantsAChargeQuestion extends QuestionBase<string> {
  controlType = 'enfants-a-charge';
  hasNone: boolean;
  fields: EnfantsAChargeField[];

  constructor(options: {} = {}) {
    super(options);
    this.hasNone = !!options['hasNone'];
    this.fields = options['fields'] || [];
  }

  toFormControl(defaultValue: any): AbstractControl {
    let group: any = {};
    let fieldsValidators = [Validators.pattern('\-?[0-9]*'),
                            Validators.min(0),
                            Validators.max(20)];

    this.fields.forEach(field => {
      group[field.label] =
        new FormControl(defaultValue ? defaultValue[field.label] : null, fieldsValidators);
    });

    if (this.hasNone) {
      group['none'] = new FormControl(defaultValue ? defaultValue['none'] : false);
    }

    return new FormGroup(group, this.validators.concat(
      (control: AbstractControl) => {

        if (control.value['none'] !== true && this.fields.every(e => e === null)) {
          return {'required': true}
        } else {
          return null;
        }
      }
    ));
  }

  accept<E>(visitor: QuestionVisitor<E>): E {
    return visitor.visitEnfantsAChargeQuestion(this);
  }
}

export class EnfantsAChargeField {
  label: string;

  constructor(options: {
    label?: string
  } = {}) {
    this.label = options.label;
  }

}

export class EnfantsAChargeQuestionValidators {
  static atLeastOneFilled(options: string[], hasNone: boolean = false) {
    return (control: AbstractControl) => {
      if (control && control.value) {
        const atLeastOneOption = options.some(option => !!control.value[option]);
        const isNoneSelected = hasNone && !!control.value['none'];

        return !atLeastOneOption && !isNoneSelected ? {'atLeastOneFilled': true} : null
      }

      return null;
    }
  }
}
