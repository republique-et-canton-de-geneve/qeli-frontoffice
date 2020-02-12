import { QuestionBase } from '../question-base.model';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { QuestionOption } from '../option.model';

function noneDetailValidator(control: AbstractControl) {
  if (control &&
      control.value &&
      control.value['none'] &&
      (!control.value['noneDetail'] || control.value['noneDetail'] === '')) {
    return {'required': true};
  }

  return null;
}

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

    return new FormGroup(group, this.validators.concat(noneDetailValidator));
  }
}
