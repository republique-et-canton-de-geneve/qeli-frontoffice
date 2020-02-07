import { QuestionBase } from '../question-base.model';
import { QeliValidators } from '../../validator/qeli-validators';

export class DateQuestion extends QuestionBase<string> {
  controlType = 'date';
  maxDate: Date;
  minDate: Date;

  constructor(options: {} = {}) {
    super(options);
    this.minDate = options['minDate'] ? options['minDate'] : null;
    this.maxDate = options['maxDate'] ? options['maxDate'] : null;

    if (this.maxDate) {
      this.validators.push(QeliValidators.maxDate(this.maxDate));
    }

    if (this.minDate) {
      this.validators.push(QeliValidators.minDate(this.minDate));
    }

    this.validators.push(QeliValidators.date);
  }
}
