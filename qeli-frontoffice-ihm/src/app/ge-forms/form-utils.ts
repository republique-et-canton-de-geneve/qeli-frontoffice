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

import { AbstractControl, UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';

export class FormUtils {

  static markAllAsDirty(control: AbstractControl) {
    if (!control.hasOwnProperty('controls')) {
      this.markControlDirty(control as UntypedFormControl);
    } else if (Array.isArray(control['controls'])) {
      this.markArrayDirty(control as UntypedFormArray);
    } else {
      this.markGroupDirty(control as UntypedFormGroup);
    }
  }

  static markGroupDirty(formGroup: UntypedFormGroup) {
    Object.keys(formGroup.controls).forEach(key =>
      this.markAllAsDirty(formGroup.get(key))
    );
  }

  static markArrayDirty(formArray: UntypedFormArray) {
    formArray.controls.forEach(control =>
      this.markAllAsDirty(control)
    );
  }

  static markControlDirty(formControl: UntypedFormControl) {
    formControl.markAsDirty();
    formControl.updateValueAndValidity();
  }
}
