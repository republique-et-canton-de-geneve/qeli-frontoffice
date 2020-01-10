import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

export class QuestionBase<T> {
  defaultValue: T;
  key: string;
  code: string;
  validators: ValidatorFn[];
  skip: (form: FormGroup) => boolean;
  help: boolean;
  controlType: string;

  constructor(options: {
    defaultValue?: T,
    key?: string,
    code?: string,
    validators?: ValidatorFn[],
    skip?: (form: FormGroup) => boolean,
    help?: boolean,
    controlType?: string
  } = {}) {
    this.defaultValue = options.defaultValue;
    this.key = options.key;
    this.code = options.code;
    this.validators = options.validators ? options.validators : [];
    this.skip = options.skip ? options.skip : () => false;
    this.help = !!options.help;
    this.controlType = options.controlType;
  }

  get required() {
    return this.validators.includes(Validators.required);
  }

  toFormControl(): AbstractControl {
    return new FormControl(this.defaultValue || null, this.validators);
  }
}
