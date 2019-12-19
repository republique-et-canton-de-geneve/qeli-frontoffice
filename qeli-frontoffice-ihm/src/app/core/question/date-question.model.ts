import { QuestionBase } from './question-base.model';

export class DateQuestion extends QuestionBase<Date> {
  controlType = 'date';

  constructor(options: {} = {}) {
    super(options);
  }
}
