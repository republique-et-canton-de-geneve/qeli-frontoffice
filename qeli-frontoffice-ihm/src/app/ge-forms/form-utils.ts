import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';

export class FormUtils {

  static markAllAsDirty(control: AbstractControl) {
    if (!control.hasOwnProperty('controls')) {
      this.markControlDirty(control as FormControl);
    } else if (Array.isArray(control['controls'])) {
      this.markArrayDirty(control as FormArray);
    } else {
      this.markGroupDirty(control as FormGroup);
    }
  }

  static markGroupDirty(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key =>
      this.markAllAsDirty(formGroup.get(key))
    );
  }

  static markArrayDirty(formArray: FormArray) {
    formArray.controls.forEach(control =>
      this.markAllAsDirty(control)
    );
  }

  static markControlDirty(formControl: FormControl) {
    formControl.markAsDirty();
    formControl.updateValueAndValidity();
  }
}
