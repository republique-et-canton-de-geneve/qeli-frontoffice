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
import { DateValidators } from './date.validators';

describe('DateValidators', () => {

  it('minDate devrait retourner un erreur si la date est inferieur à 2010-01-01', () => {
    const minDate = moment('2010-01-01').toDate();

    expect(DateValidators.minDate(minDate)(null)).toEqual(null);
    expect(DateValidators.minDate(minDate)(<AbstractControl>{value: null})).toBeNull();
    expect(DateValidators.minDate(minDate)(<AbstractControl>{value: 'abc'})).toBeNull();
    expect(DateValidators.minDate(minDate)(<AbstractControl>{value: '2010-01-01'})).toBeNull();
    expect(DateValidators.minDate(minDate)(<AbstractControl>{value: '2010-01-02'})).toBeNull();
    expect(DateValidators.minDate(minDate)(<AbstractControl>{value: '1900-01-01'})).toEqual({'minDate': true});
  });

  it('maxDate devrait retourner un erreur si la date est superieur à 2010-01-01', () => {
    const maxDate = moment('2010-01-01').toDate();

    expect(DateValidators.maxDate(maxDate)(null)).toEqual(null);
    expect(DateValidators.maxDate(maxDate)(<AbstractControl>{value: null})).toBeNull();
    expect(DateValidators.maxDate(maxDate)(<AbstractControl>{value: 'abc'})).toBeNull();
    expect(DateValidators.maxDate(maxDate)(<AbstractControl>{value: '2010-01-01'})).toBeNull();
    expect(DateValidators.maxDate(maxDate)(<AbstractControl>{value: '2010-01-02'})).toEqual({'maxDate': true});
    expect(DateValidators.maxDate(maxDate)(<AbstractControl>{value: '1900-01-01'})).toBeNull();
  });
});
