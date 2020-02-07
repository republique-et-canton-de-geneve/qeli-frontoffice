import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { QuestionComponent } from '../question.component';
import { DateQuestion } from './date-question.model';
import { FormGroup } from '@angular/forms';
import { RegisterQuestionComponent } from '../question-registry';
import * as moment from 'moment';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { BowserService } from '../../common/bowser.service';
import { NgbDateTransformer } from './ngb-date.transformer';

@RegisterQuestionComponent(new DateQuestion().controlType)
@Component({
  selector: 'app-date-question',
  templateUrl: './date-question.component.html',
  styleUrls: ['./date-question.component.scss']
})
export class DateQuestionComponent implements QuestionComponent<string>, OnInit, AfterViewInit {
  @Input() question: DateQuestion;
  @Input() form: FormGroup;
  showDatePicker = false;

  @ViewChild('textInputDate') textInputDate: ElementRef<HTMLInputElement>;

  constructor(private bowserService: BowserService) {

  }

  ngOnInit(): void {
    this.form.controls[this.question.key].valueChanges.subscribe(this.updateTextInputData.bind(this));
  }

  ngAfterViewInit(): void {
    if (this.form.value[this.question.key]) {
      this.updateTextInputData(this.form.value[this.question.key]);
    }
  }

  private updateTextInputData(value: string) {
    const date = moment(value, 'YYYY-MM-DD', true);
    if (this.textInputDate && date.isValid()) {
      this.textInputDate.nativeElement.value = date.format('DD.MM.YYYY');
    }
  }

  onTypingDate(input: string) {
    if (input.replace('#', '').length === 'DD.MM.YYYY'.length) {
      this.onDateTyped(input);
    }
  }

  onDateTyped(input: string) {
    this.form.controls[this.question.key].setValue(
      moment(input, 'DD.MM.YYYY', true).format('YYYY-MM-DD')
    );

    this.form.controls[this.question.key].markAsDirty();
  }

  onDatePicked(input: NgbDate) {
    this.form.controls[this.question.key].setValue(
      moment(NgbDateTransformer.parse(input)).format('YYYY-MM-DD')
    );
  }

  get useNativeInputDate() {
    return this.bowserService.mobile;
  }

  get startDate() {
    const startDate = moment(this.form.value[this.question.key], 'YYYY-MM-DD', true);

    if (startDate.isValid()) {
      return NgbDateTransformer.toNgbDate(startDate.toDate());
    }
  }

  get minDate() {
    return NgbDateTransformer.toNgbDate(this.question.minDate);
  }

  get maxDate() {
    return NgbDateTransformer.toNgbDate(this.question.maxDate);
  }
}
