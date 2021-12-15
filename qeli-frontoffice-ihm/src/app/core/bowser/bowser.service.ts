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

import { Injectable } from '@angular/core';
import * as Bowser from 'bowser';
import ParsedResult = Bowser.Parser.ParsedResult;

@Injectable({
  providedIn: 'root'
})
export class BowserService {
  private browser: ParsedResult;

  constructor() {
    this.browser = Bowser.parse(window.navigator.userAgent);
  }

  get mobile(): boolean {
    return this.browser.platform.type === 'mobile' ||
           this.browser.platform.type === 'tablet';
  }
}
