import { AbstractControl, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { Prestation } from '../common/prestation.model';
import { Categorie, Subcategorie } from './question-categorie.model';
import { QuestionVisitor } from './question-visitor';

export abstract class QuestionBase<T> {
  controlType: string;
  key: string;
  code: string;
  identifier: string;
  categorie?: Categorie;
  subcategorie?: Subcategorie;
  help: boolean;
  validators: ValidatorFn[];
  altText: (value: any) => string;
  labelParameters: { [key: string]: string | ((value: any) => string) };
  skip: (value: any, prestatiosnEligibles: Prestation[]) => boolean;
  defaultAnswer: (value: any) => T;
  eligibilite: Eligibilite[];

  constructor(options: {
    controlType?: string,
    key?: string,
    code?: string,
    categorie?: Categorie,
    subcategorie?: Subcategorie,
    help?: boolean,
    validators?: ValidatorFn[],
    altText?: (value: any) => string,
    labelParameters?: { [key: string]: string | ((value: any) => string) },
    skip?: (value: any, prestatiosnEligibles: Prestation[]) => any,
    defaultAnswer?: (value: any) => T,
    eligibilite?: Eligibilite[]
  } = {}) {
    this.controlType = options.controlType;
    this.key = options.key;
    this.code = options.code;
    this.identifier = `${this.code}_${this.key}`;
    this.categorie = options.categorie;
    this.subcategorie = options.subcategorie;
    this.help = !!options.help;
    this.validators = options.validators ? options.validators : [];
    this.altText = options.altText ? options.altText : () => null;
    this.labelParameters = options.labelParameters ? options.labelParameters : {};
    this.skip = options.skip ? options.skip : () => false;
    this.defaultAnswer = options.defaultAnswer ? options.defaultAnswer : () => null;
    this.eligibilite = options.eligibilite ? options.eligibilite : [];
  }

  get required() {
    return this.validators.includes(Validators.required);
  }

  getTranslationKey(value: any) {
    const altText = this.altText(value);
    return `question.${this.key}.${altText ? 'altText.' + altText : 'label'}`;
  }

  createLabelParameters(value: any) {
    let labelParametersResult: { [key: string]: string } = {};

    Object.keys(this.labelParameters).forEach(labelParam => {
      if (typeof this.labelParameters[labelParam] === 'function') {
        labelParametersResult[labelParam] = (this.labelParameters[labelParam] as (value: any) => string)(value);
      } else {
        labelParametersResult[labelParam] = this.labelParameters[labelParam] as string;
      }
    });

    return labelParametersResult;
  }

  toFormControl(defaultValue: T): AbstractControl {
    return new FormControl(defaultValue, this.validators);
  }

  abstract accept<E>(visitor: QuestionVisitor<E>): E;
}

export class Eligibilite {
  prestation: Prestation;
  isEligible?: (value: any) => boolean;
}
