import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { I18nString } from '../../core/i18n/i18nstring.model';

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
  @Input() errorLabels: { [key: string]: I18nString } = {};

  get isValid() {
    return this.control.pristine ||
           this.control.valid;
  }

  get errors() {
    const errors = this.control.errors;
    return errors ? Object.keys(errors) : [];
  }
}
