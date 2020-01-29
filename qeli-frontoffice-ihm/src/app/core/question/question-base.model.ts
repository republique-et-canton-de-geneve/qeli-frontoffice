import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Prestation } from '../common/prestation.model';

export class QuestionBase<T> {
  controlType: string;
  key: string;
  code: string;
  help: boolean;
  validators: ValidatorFn[];
  altText: (form: FormGroup) => string;
  labelParameters: any;
  // TODO Peut-être changer à skip et laisser les questions sans réponse quand elles n'ont pas de relevances
  defaultAnswer: (form: FormGroup) => any;
  eligibilite: Eligibilite[];

  constructor(options: {
    controlType?: string,
    key?: string,
    code?: string,
    help?: boolean,
    validators?: ValidatorFn[],
    altText?: (form: FormGroup) => string,
    labelParameters?: any,
    defaultAnswer?: (form: FormGroup) => any,
    eligibilite?: Eligibilite[]
  } = {}) {
    this.controlType = options.controlType;
    this.key = options.key;
    this.code = options.code;
    this.help = !!options.help;
    this.validators = options.validators ? options.validators : [];
    this.altText = options.altText ? options.altText : () => null;
    this.labelParameters = options.labelParameters ? options.labelParameters : {};
    this.defaultAnswer = options.defaultAnswer;
    this.eligibilite = options.eligibilite ? options.eligibilite : [];
  }

  get required() {
    return this.validators.includes(Validators.required);
  }

  toFormControl(defaultValue:T): AbstractControl {
    return new FormControl(defaultValue, this.validators);
  }
}

export class Eligibilite {
  prestation: Prestation;
  isEligible: (form: FormGroup) => boolean;

  constructor(prestation: Prestation, isEligible: (form: FormGroup) => boolean) {
    this.prestation = prestation;
    this.isEligible = isEligible;
  }
}
