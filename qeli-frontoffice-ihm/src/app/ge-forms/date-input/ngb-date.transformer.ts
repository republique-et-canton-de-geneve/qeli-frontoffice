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
