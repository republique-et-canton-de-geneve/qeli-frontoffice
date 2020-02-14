import { QuestionBase } from '../question-base.model';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { QuestionOption } from '../option.model';
import { QuestionVisitor } from '../question-visitor';

export class CheckboxGroupQuestion extends QuestionBase<any> {
  controlType = 'checkbox-group';
  hasNone: boolean;
  options: QuestionOption[];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
    this.hasNone = !!options['hasNone'];
  }

  toFormControl(defaultValue: any): AbstractControl {
    let group: any = {};

    group['choices'] = new FormArray(
      defaultValue && defaultValue['choices'] ? defaultValue['choices'].map(choice => new FormControl(choice)) : []
    );

    if (this.hasNone) {
      group['none'] = new FormControl(defaultValue ? defaultValue['none'] : false);
      group['noneDetail'] = new FormControl(defaultValue ? defaultValue['noneDetail'] : null);
    }

    return new FormGroup(group, this.validators);
  }

  accept<E>(visitor: QuestionVisitor<E>): E {
    return visitor.visitCheckboxGroupQuestion(this);
  }
}

export class CheckboxGroupValidators {
  static atLeastOneSelected(options: string[], hasNone: boolean = false) {
    return (control: AbstractControl) => {
      if (control && control.value) {
        const atLeastOneOption = options.some(option => control.value['choices'].includes(option));
        const isNoneSelected = hasNone && !!control.value['none'];

        return !atLeastOneOption && !isNoneSelected ? {'atLeastOneSelected': true} : null;
      }

      return null;
    }
  }

  static noneDetailRequired(control: AbstractControl) {
    if (control &&
        control.value &&
        control.value['none'] &&
        (!control.value['noneDetail'] || control.value['noneDetail'] === '')) {
      return {'required': true};
    }

    return null;
  }
}
