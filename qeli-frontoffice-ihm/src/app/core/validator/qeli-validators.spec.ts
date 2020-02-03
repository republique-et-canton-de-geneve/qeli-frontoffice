import { QeliValidators } from './qeli-validators';
import { AbstractControl } from '@angular/forms';
import * as moment from 'moment';

describe('QeliValidators', () => {

  it('minDate devrait retourner un erreur si la date est inferieur à 2010-01-01', () => {
    const minDate = moment('2010-01-01').toDate();

    expect(QeliValidators.minDate(minDate)(null)).toEqual(null);
    expect(QeliValidators.minDate(minDate)(<AbstractControl>{value: null})).toBeNull();
    expect(QeliValidators.minDate(minDate)(<AbstractControl>{value: 'abc'})).toBeNull();
    expect(QeliValidators.minDate(minDate)(<AbstractControl>{value: '2010-01-01'})).toBeNull();
    expect(QeliValidators.minDate(minDate)(<AbstractControl>{value: '2010-01-02'})).toBeNull();
    expect(QeliValidators.minDate(minDate)(<AbstractControl>{value: '1900-01-01'})).toEqual({'minDate': true});
  });

  it('maxDate devrait retourner un erreur si la date est superieur à 2010-01-01', () => {
    const maxDate = moment('2010-01-01').toDate();

    expect(QeliValidators.maxDate(maxDate)(null)).toEqual(null);
    expect(QeliValidators.maxDate(maxDate)(<AbstractControl>{value: null})).toBeNull();
    expect(QeliValidators.maxDate(maxDate)(<AbstractControl>{value: 'abc'})).toBeNull();
    expect(QeliValidators.maxDate(maxDate)(<AbstractControl>{value: '2010-01-01'})).toBeNull();
    expect(QeliValidators.maxDate(maxDate)(<AbstractControl>{value: '2010-01-02'})).toEqual({'maxDate': true});
    expect(QeliValidators.maxDate(maxDate)(<AbstractControl>{value: '1900-01-01'})).toBeNull();
  });
});
