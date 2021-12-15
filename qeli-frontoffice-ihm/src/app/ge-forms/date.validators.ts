/*
 * qeli-frontoffice
 *
 * Copyright (C) 2019-2021 Republique et canton de Geneve
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { AbstractControl } from '@angular/forms';
import * as moment from 'moment';

export class DateValidators {
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
