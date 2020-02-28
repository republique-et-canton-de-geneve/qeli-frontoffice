import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { QuestionComponent } from '../question.component';
import { DateQuestion } from './date-question.model';
import { FormGroup } from '@angular/forms';
import { RegisterQuestionComponent } from '../question-registry';
import * as moment from 'moment';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { BowserService } from '../../../service/bowser.service';
import { NgbDateTransformer } from './ngb-date.transformer';
import { QuestionOption } from '../option.model';

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
    this.dateControl.valueChanges.subscribe(this.updateTextInputData.bind(this));
  }

  ngAfterViewInit(): void {
    if (this.dateControl.value) {
      this.updateTextInputData(this.dateControl.value);
    }
  }

  private updateTextInputData(value: string) {
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

  onShortcutChanged(checked: boolean, shortcut: QuestionOption) {
    if (checked && shortcut !== null) {
      this.dateControl.setValue(null);
    }
  }

  get useNativeInputDate() {
    return this.bowserService.mobile;
  }

  private get formGroup() {
    return this.form.controls[this.question.key] as FormGroup;
  }

  get dateControl() {
    return this.formGroup.controls['value'];
  }

  get startDate() {
    const startDate = moment(this.dateControl.value, 'YYYY-MM-DD', true);

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

  get isShortcutSelected() {
    return this.formGroup.value['shortcut'] !== null &&
           this.formGroup.value['shortcut'] !== undefined;
  }

  get isDateValid() {
    return this.dateControl.pristine || this.dateControl.valid;
  }

  get dateErrors() {
    return !this.isDateValid ? Object.keys(this.dateControl.errors) : null;
  }
}
