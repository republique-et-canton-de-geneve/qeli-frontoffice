import { AbstractControl } from '@angular/forms';
import * as moment from 'moment';

export class QeliValidators {
  static past(control: AbstractControl) {
    if (control && control.value) {
      const date = moment(control.value, 'YYYY-MM-DD', true);
      return !moment().isAfter(date) ? {'past': true} : null;
    }

    return null;
  }

  static minYear(year: number) {
    return (control: AbstractControl) => {
      if (control && control.value) {
        const date = moment(control.value, 'YYYY-MM-DD', true);
        const minDate = moment().subtract(year, 'year');
        return !minDate.isBefore(date) ? {'minYear': minDate} : null;
      }

      return null;
    };
  }

  static atLeastOneSelected(options: string[]) {
    return (control: AbstractControl) => {
      if (control && control.value && options.every(option => !control.value[option])) {
        return {'atLeastOneSelected': true}
      }

      return null;
    }
  }
}
