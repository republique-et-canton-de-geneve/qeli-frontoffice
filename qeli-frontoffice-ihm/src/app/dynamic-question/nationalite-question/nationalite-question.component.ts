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

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
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
  @Input() disableFocusOnInit: boolean;

  numberOfNationalites = 1;
  maxNumberOfNationalites = 3;

  constructor(private ref: ChangeDetectorRef) {

  }

  ngOnInit() {
    const paysValues = this.form.value[this.question.key]['pays'];
    this.numberOfNationalites = paysValues ? paysValues.length : 1;
    this.form.controls[this.question.key].statusChanges.subscribe(() => this.ref.markForCheck());
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

  get isValid() {
    return this.form.controls[this.question.key].pristine ||
           this.form.controls[this.question.key].valid;
  }
}
