import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';

export class FormUtils {

  static markAllAsDirty(control: AbstractControl) {
    switch (control.constructor.name) {
      case "FormGroup":
        this.markGroupDirty(control as FormGroup);
        break;
      case "FormArray":
        this.markArrayDirty(control as FormArray);
        break;
      case "FormControl":
        this.markControlDirty(control as FormControl);
        break;
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
