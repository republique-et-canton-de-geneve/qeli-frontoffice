import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { BowserService } from '../../core/bowser/bowser.service';
import { AbstractControl } from '@angular/forms';
import { NgbDateTransformer } from './ngb-date.transformer';

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss']
})
export class DateInputComponent implements OnInit, AfterViewInit {

  @Input() dateControl: AbstractControl;
  @Input() dateControlName: string;
  @Input() minDate: Date = null;
  @Input() maxDate: Date = null;
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() focusOnInit: boolean = false;
  @Input() identifier: string;

  @ViewChild('textInputDate', {static: false}) textInputDate: ElementRef<HTMLInputElement>;

  showDatePicker = false;

  constructor(private bowserService: BowserService) {

  }

  ngOnInit(): void {
    this.dateControl.valueChanges.subscribe(this.setTextInputData.bind(this));
  }

  ngAfterViewInit(): void {
    if (this.dateControl.value) {
      this.setTextInputData(this.dateControl.value);
    }
  }

  setTextInputData(value: string) {
    const date = moment(value, 'YYYY-MM-DD', true);
    if (this.textInputDate && date.isValid()) {
      this.textInputDate.nativeElement.value = date.format('DD.MM.YYYY');
    } else {
      this.textInputDate.nativeElement.value = '##.##.####';
    }
  }

  onTypingDate(input: string) {
    if (input.replace('#', '').length === 'DD.MM.YYYY'.length) {
      this.onDateTyped(input);
    }
  }

  onDateTyped(input: string) {
    this.dateControl.setValue(
      moment(input, 'DD.MM.YYYY', true).format('YYYY-MM-DD')
    );

    this.dateControl.markAsDirty();
  }

  onDatePicked(input: NgbDate) {
    this.dateControl.setValue(
      moment(NgbDateTransformer.parse(input)).format('YYYY-MM-DD')
    );
  }

  get useNativeInputDate() {
    return this.bowserService.mobile;
  }

  get startDate() {
    const startDate = moment(this.dateControl.value, 'YYYY-MM-DD', true);

    if (startDate.isValid()) {
      return NgbDateTransformer.toNgbDate(startDate.toDate());
    }
  }

  get ngbMinDate() {
    return this.minDate ? NgbDateTransformer.toNgbDate(this.minDate) : null;
  }

  get ngbMaxDate() {
    return this.maxDate ? NgbDateTransformer.toNgbDate(this.maxDate) : null;
  }

}
