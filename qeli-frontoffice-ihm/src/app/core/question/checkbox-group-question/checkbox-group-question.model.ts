import { QuestionBase } from '../question-base.model';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { QuestionOption } from '../option.model';

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

    this.options.forEach(option => {
      group[option.label] = new FormControl(defaultValue ? defaultValue[option.label] : false)
    });

    if (this.hasNone) {
      group['NONE'] = new FormControl(defaultValue ? defaultValue['NONE'] : false);
      group['noneDetail'] = new FormControl(defaultValue ? defaultValue['noneDetail'] : false);
    }

    return new FormGroup(group, this.validators.concat(
      (control) => {
        if (control.value['NONE'] && (!control.value['noneDetail'] || control.value['noneDetail'] === '')) {
          return {'required': true};
        }

        return null;
      }
    ));
  }
}
