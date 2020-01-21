import { QuestionBase } from '../question-base.model';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

export class CheckboxGroupQuestion extends QuestionBase<any> {
  controlType = 'checkbox-group';
  hasNone: boolean;
  options: string[];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
    this.hasNone = !!options['hasNone'];
    this.defaultValue = !this.defaultValue ? [] : this.defaultValue;
  }

  toFormControl(): AbstractControl {
    let group: any = {};

    this.options.forEach(option => {
      group[option] = new FormControl(this.defaultValue.includes(option))
    });

    if (this.hasNone) {
      group['none'] = new FormControl(this.defaultValue.includes('none'));
      group['noneDetail'] = new FormControl();
    }

    return new FormGroup(group, this.validators.concat(
      (control) => {
        if (control.value['none'] && (!control.value['noneDetail'] || control.value['noneDetail'] === '')) {
          return {'required': true};
        }

        return null;
      }
    ));
  }
}
