import { QeliValidators } from './qeli-validators';
import { AbstractControl } from '@angular/forms';

describe('QeliValidators', () => {
  it('past devrait retourner une erreur si la date est dans le futur', () => {
    expect(QeliValidators.past(null)).toEqual(null);
    expect(QeliValidators.past(<AbstractControl>{value: null})).toEqual(null);
    expect(QeliValidators.past(<AbstractControl>{value: '2010-01-01'})).toEqual(null);
    expect(QeliValidators.past(<AbstractControl>{value: '2200-01-01'})).toEqual({'past': true});
  });

  it('minYear devrait retourner une erreur si la date est inférieure à -130 ans', () => {
    expect(QeliValidators.minYear(130)(null)).toEqual(null);
    expect(QeliValidators.minYear(130)(<AbstractControl>{value: null})).toEqual(null);
    expect(QeliValidators.minYear(130)(<AbstractControl>{value: '2010-01-01'})).toEqual(null);
    expect(QeliValidators.minYear(130)(<AbstractControl>{value: '1800-01-01'})).not.toBeNull();
  });
});
