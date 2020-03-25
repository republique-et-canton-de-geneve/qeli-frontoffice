import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-input-container',
  templateUrl: './input-container.component.html',
  styleUrls: ['./input-container.component.scss']
})
export class InputContainerComponent {
  @Input() identifier: string;
  @Input() formControlName: string;
  @Input() label: string;
  @Input() required = false;
  @Input() control: AbstractControl;

  get isValid() {
    return this.control.pristine ||
           this.control.valid;
  }

  get errors() {
    const errors = this.control.errors;
    return errors ? Object.keys(errors) : [];
  }
}
