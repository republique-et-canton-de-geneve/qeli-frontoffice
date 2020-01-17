import {
  AfterViewInit, Component, ElementRef, Input, OnDestroy, QueryList, ViewChild, ViewChildren
} from '@angular/core';
import { RegisterQuestionComponent } from '../question-registry';
import { QuestionComponent } from '../question.component';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { NationaliteQuestion } from './nationalite-question.model';

@RegisterQuestionComponent(new NationaliteQuestion().controlType)
@Component({
  selector: 'app-nationalite-question',
  templateUrl: './nationalite-question.component.html',
  styleUrls: ['./nationalite-question.component.scss']
})
export class NationaliteQuestionComponent implements QuestionComponent<any>, AfterViewInit {
  @Input() question: NationaliteQuestion;
  @Input() form: FormGroup;

  @ViewChild('checkboxApatride') checkboxApatride: ElementRef;
  @ViewChildren('selectPays') selectPays: QueryList<ElementRef>;

  numberOfNationalites = 1;
  maxNumberOfNationalites = 3;

  ngAfterViewInit() {
    this.selectPays.toArray()[0].nativeElement.focus();
  }

  get isApatride() {
    return this.form.value[this.question.key]['apatride'];
  }

  onApatrideChanged() {
    if (this.isApatride) {
      this.paysArray.disable();
    } else {
      this.paysArray.enable();
    }
  }

  private get paysArray() {
    const nationaliteControl = (this.form.controls[this.question.key] as FormGroup);
    return nationaliteControl.controls['pays'] as FormArray;
  }

  popOrClearPaysControl() {
    if (this.numberOfNationalites === 1) {
      this.paysArray.setValue([null]);
    } else {
      this.paysArray.removeAt(this.paysArray.length - 1);
      this.numberOfNationalites -= 1;
    }
  }

  addPaysControl() {
    if (this.numberOfNationalites < this.maxNumberOfNationalites) {
      this.paysArray.push(new FormControl());
      this.numberOfNationalites += 1;
    }
  }

  hasPays() {
    return (this.paysArray.value as []).filter(e => e !== null).length > 0;
  }

  hasUnsetPays() {
    return (this.paysArray.value as []).filter(e => e === null).length > 0;
  }

}
