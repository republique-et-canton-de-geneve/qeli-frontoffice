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
