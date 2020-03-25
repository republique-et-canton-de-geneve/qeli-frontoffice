import { QuestionBase } from '../question-base.model';
import { AbstractControl, FormArray, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { QuestionOption } from '../option.model';
import { QuestionVisitor } from '../question-visitor';
import { ReponseProgressive } from '../../../model/reponse.model';

export class CheckboxGroupQuestion extends QuestionBase<any> {
  controlType = 'checkbox-group';
  hasNone: boolean;
  hasInconnu: boolean;
  options: (QuestionOption | CheckboxGroup)[];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
    this.hasNone = !!options['hasNone'];
    this.hasInconnu = !!options['hasInconnu'];
  }

  protected requiredValidator(): ValidatorFn {
    return CheckboxGroupValidators.atLeastOneSelected(
      this.options.map(option => option.label),
      this.hasNone || this.hasInconnu
    );
  }

  toFormControl(defaultValue: any): AbstractControl {
    let group: any = {};

    if (this.hasNone || this.hasInconnu) {
      group['none'] = new FormControl(defaultValue ? defaultValue['none'] : ReponseProgressive.NON);
    }

    group['choices'] = new FormArray(
      defaultValue && defaultValue['choices'] ? defaultValue['choices'].map(choice => new FormControl(choice)) : []
    );

    return new FormGroup(group, this.validators);
  }

  accept<E>(visitor: QuestionVisitor<E>): E {
    return visitor.visitCheckboxGroupQuestion(this);
  }

  get listOfOptions(): QuestionOption[] {
    return this.options.map(
      optionOrGroup => optionOrGroup.hasOwnProperty('options') ?
                       (optionOrGroup as CheckboxGroup).options : [optionOrGroup as QuestionOption]
    ).reduce((c, r) => r.concat(c), []);
  }
}

export class CheckboxGroup {
  label: string;
  options: QuestionOption[];
}

export class CheckboxGroupValidators {
  static atLeastOneSelected(options: string[], hasNoneOrInconnu: boolean = false) {
    return (control: AbstractControl) => {
      if (control && control.value) {
        const atLeastOneOption = options.some(option => control.value['choices'].includes(option));
        const isNoneSelected = hasNoneOrInconnu && control.value['none'] !== ReponseProgressive.NON;
        return !atLeastOneOption && !isNoneSelected ? {'atLeastOneSelected': true} : null;
      }

      return null;
    }
  }
}
