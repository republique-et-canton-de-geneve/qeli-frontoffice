import { AbstractControl } from '@angular/forms';
import * as moment from 'moment';

export class QeliValidators {
  static date(control: AbstractControl) {
    if (control && control.value) {
      const date = moment(control.value, 'YYYY-MM-DD', true);
      return !date.isValid() ? {'invalidDate': true} : null;
    }

    return null;
  }

  static maxDate(maxDate: Date) {
    return (control: AbstractControl) => {
      if (control && control.value) {
        const date = moment(control.value.toString(), 'YYYY-MM-DD', true);
        return moment(maxDate).isBefore(date) ? {'maxDate': true} : null;
      }

      return null;
    };
  }

  static minDate(minDate: Date) {
    return (control: AbstractControl) => {
      if (control && control.value) {
        const date = moment(control.value.toString(), 'YYYY-MM-DD', true);
        return moment(minDate).isAfter(date) ? {'minDate': true} : null;
      }

      return null;
    };
  }
}
