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

import * as moment from 'moment';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

export class NgbDateTransformer {
  static toNgbDate(date: Date): NgbDate {
    const d = moment(date);
    return new NgbDate(d.get('year'), d.get('month') + 1, d.get('date'));
  }

  static parse(date: NgbDate): Date {
    return moment({
      year: date.year,
      month: date.month - 1,
      day: date.day
    }).toDate();
  }
}
