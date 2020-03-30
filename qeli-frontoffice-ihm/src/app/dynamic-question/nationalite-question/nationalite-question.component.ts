import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { RegisterQuestionComponent } from '../model/question-registry.model';
import { QuestionComponent } from '../model/question.component';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { NATIONALITE_CONTROL_TYPE, NationaliteAnswer, NationaliteQuestion } from './nationalite-question.model';

@RegisterQuestionComponent(NATIONALITE_CONTROL_TYPE)
@Component({
  selector: 'app-nationalite-question',
  templateUrl: './nationalite-question.component.html',
  styleUrls: ['./nationalite-question.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NationaliteQuestionComponent implements OnInit, QuestionComponent<NationaliteAnswer> {
  @Input() question: NationaliteQuestion;
  @Input() form: FormGroup;

  numberOfNationalites = 1;
  maxNumberOfNationalites = 3;

  ngOnInit() {
    this.numberOfNationalites = this.form.value[this.question.key]['pays'].length;
  }

  onApatrideChanged() {
    if (this.isApatride) {
      this.paysArray.disable();
    } else {
      this.paysArray.enable();
    }
  }

  get paysArray() {
    const nationaliteControl = (this.form.controls[this.question.key] as FormGroup);
    return nationaliteControl.controls['pays'] as FormArray;
  }

  get isApatride() {
    return this.form.value[this.question.key]['apatride'];
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

}
