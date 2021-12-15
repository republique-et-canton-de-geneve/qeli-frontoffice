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
import { I18nString } from '../../core/i18n/i18nstring.model';

@Component({
  selector: 'app-help-block',
  templateUrl: './help-block.component.html',
  styleUrls: ['./help-block.component.scss']
})
export class HelpBlockComponent {
  @Input() collapsable: boolean;
  i18n: I18nString;
  collapsed = true;

  constructor() {
  }

  @Input()
  set text(text: I18nString) {
    this.collapsed = true;
    this.i18n = text;
  }
}
