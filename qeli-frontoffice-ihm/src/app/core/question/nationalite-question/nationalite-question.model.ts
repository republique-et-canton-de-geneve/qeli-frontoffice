import { QuestionBase } from '../question-base.model';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { Pays } from './pays.model';

export class NationaliteQuestion extends QuestionBase<any> {
  controlType = 'nationalite';
  paysOptions = Object.values(Pays);

  constructor(options: {} = {}) {
    super(options);
  }

  toFormControl(defaultValue: any): AbstractControl {
    let group: any = {};

    group['apatride'] = new FormControl(defaultValue ? defaultValue.apatride : false);
    group['pays'] = new FormArray(
      defaultValue && defaultValue.pays ? defaultValue.pays.map(pay => new FormControl(pay)) : [new FormControl()]
    );

    return new FormGroup(group, this.validators.concat(
      (control: AbstractControl) => {

        if (control.value['apatride'] !== true &&
            (!control.value['pays'] || (control.value['pays'] as string[]).every(e => e === null))
        ) {
          return {'required': true}
        } else {
          return null;
        }
      }
    ));
  }

  get required() {
    return true;
  }
}

