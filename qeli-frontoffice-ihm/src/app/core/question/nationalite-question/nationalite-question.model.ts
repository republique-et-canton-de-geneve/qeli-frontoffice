import { QuestionBase } from '../question-base.model';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { Pays } from '../../common/pays.model';

export class NationaliteQuestion extends QuestionBase<string> {
  controlType = 'nationalite';
  paysOptions = Object.values(Pays);

  constructor(options: {} = {}) {
    super(options);
  }

  toFormControl(): AbstractControl {
    let group: any = {};

    group['apatride'] = new FormControl(false);
    group['pays'] = new FormArray([new FormControl()]);


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

