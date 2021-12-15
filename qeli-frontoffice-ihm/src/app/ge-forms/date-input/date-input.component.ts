/*
 * qeli-frontoffice
 *
 * Copyright (C) 2019-2021 Republique et canton de Geneve
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { BowserService } from '../../core/bowser/bowser.service';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbDateTransformer } from './ngb-date.transformer';

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss']
})
export class DateInputComponent implements OnInit, AfterViewInit {

  @Input() form: FormGroup;
  @Input() controlName: string;
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

  get isValid() {
    return this.dateControl.pristine || this.dateControl.valid;
  }

  get dateControl() {
    return this.form.controls[this.controlName] as FormControl;
  }

}
