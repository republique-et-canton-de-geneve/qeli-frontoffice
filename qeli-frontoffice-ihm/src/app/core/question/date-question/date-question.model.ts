import { QuestionBase } from '../question-base.model';
import { QuestionVisitor } from '../question-visitor';
import { QuestionOption } from '../option.model';
import { AbstractControl, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';

export class DateQuestion extends QuestionBase<DateAnswer> {
  controlType = 'date';
  maxDate: Date;
  minDate: Date;
  shortcuts: QuestionOption[];

  constructor(options: {} = {}) {
    super(options);

    this.shortcuts = options['shortcuts'] ? options['shortcuts'] : [];
    this.minDate = options['minDate'] ? options['minDate'] : null;
    this.maxDate = options['maxDate'] ? options['maxDate'] : null;
  }

  protected requiredValidator(): ValidatorFn {
    return DateQuestionValidators.atLeastOneSelected(this.shortcuts.length > 0);
  }

  toFormControl(defaultValue: any): AbstractControl {
    let group: any = {};

    if (this.shortcuts && this.shortcuts.length > 0) {
      group['shortcut'] = new FormControl(defaultValue ? defaultValue['shortcut'] : null);
    }

    let dateValidators: ValidatorFn[] = [];

    if (this.maxDate) {
      dateValidators.push(DateQuestionValidators.maxDate(this.maxDate));
    }

    if (this.minDate) {
      dateValidators.push(DateQuestionValidators.minDate(this.minDate));
    }

    dateValidators.push(DateQuestionValidators.date);

    group['value'] = new FormControl(
      defaultValue && defaultValue['value'] ? defaultValue['value'] : null,
      dateValidators
    );

    return new FormGroup(group, this.validators);
  }

  accept<E>(visitor: QuestionVisitor<E>): E {
    return visitor.visitDateQuestion(this);
  }
}

export interface DateAnswer {
  shortcut: string;
  value: string;
}

export class DateQuestionValidators {
  static atLeastOneSelected(hasShortcut: boolean = false) {
    return (control: AbstractControl) => {
      if (control && control.value) {
        const isDateFilled = !!control.value['value'];
        const isShortcutSelected = hasShortcut &&
                                   control.value['shortcut'] &&
                                   control.value['shortcut'] !== 'NO_SHORTCUT';

        return !isDateFilled && !isShortcutSelected ? {'required': true} : null;
      }

      return null;
    }
  }

  static date(control: AbstractControl) {
    if (control && control.value) {
      const date = moment(control.value, 'YYYY-MM-DD', true);
      return !date.isValid() ? {'invalidDate': true} : null;
    }

    return null;
  }

  static maxDate(maxDate: Date) {
    return (control: AbstractControl) => {
      if (control && control.value) {
        const date = moment(control.value.toString(), 'YYYY-MM-DD', true);
        return moment(maxDate).isBefore(date) ? {'maxDate': true} : null;
      }

      return null;
    };
  }

  static minDate(minDate: Date) {
    return (control: AbstractControl) => {
      if (control && control.value) {
        const date = moment(control.value.toString(), 'YYYY-MM-DD', true);
        return moment(minDate).isAfter(date) ? {'minDate': true} : null;
      }

      return null;
    };
  }
}
