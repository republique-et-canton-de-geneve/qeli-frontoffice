import { QuestionBase } from '../question-base.model';
import { QeliValidators } from '../../validator/qeli-validators';
import { QuestionVisitor } from '../question-visitor';
import { QuestionOption } from '../option.model';
import { AbstractControl, FormControl, FormGroup, ValidatorFn } from '@angular/forms';

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

  toFormControl(defaultValue: any): AbstractControl {
    let group: any = {};

    if (this.shortcuts && this.shortcuts.length > 0) {
      group['shortcut'] = new FormControl(defaultValue ? defaultValue['shortcut'] : null);
    }

    let dateValidators: ValidatorFn[] = [];

    if (this.maxDate) {
      dateValidators.push(QeliValidators.maxDate(this.maxDate));
    }

    if (this.minDate) {
      dateValidators.push(QeliValidators.minDate(this.minDate));
    }

    dateValidators.push(QeliValidators.date);

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
}
