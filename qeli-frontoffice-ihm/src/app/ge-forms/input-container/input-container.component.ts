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
