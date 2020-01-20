import { QuestionBase } from '../question-base.model';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

export class CheckboxGroupQuestion extends QuestionBase<any> {
  controlType = 'checkbox-group';
  options: string[];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
    this.defaultValue = !this.defaultValue ? [] : this.defaultValue;
  }

  toFormControl(): AbstractControl {
    let group: any = {};

    this.options.forEach(option => {
      group[option] = new FormControl(this.defaultValue.includes(option))
    });

    return new FormGroup(group, this.validators);
  }
}
