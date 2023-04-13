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

import { AfterViewInit, Component, ElementRef, Input, ViewChildren } from '@angular/core';
import { QuestionComponent } from '../model/question.component';
import {
  CHECKBOX_GROUP_CONTROL_TYPE, CheckboxGroupAnswer, CheckboxGroupQuestion
} from './checkbox-group-question.model';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { RegisterQuestionComponent } from '../model/question-registry.model';

@RegisterQuestionComponent(CHECKBOX_GROUP_CONTROL_TYPE)
@Component({
  selector: 'app-checkbox-group-question',
  templateUrl: './checkbox-group-question.component.html',
  styleUrls: ['./checkbox-group-question.component.scss']
})
export class CheckboxGroupQuestionComponent implements AfterViewInit, QuestionComponent<CheckboxGroupAnswer> {
  @Input() question: CheckboxGroupQuestion;
  @Input() form: UntypedFormGroup;
  @Input() disableFocusOnInit: boolean;

  @ViewChildren('optionCheckboxes') optionCheckboxes: ElementRef<HTMLInputElement>[];

  ngAfterViewInit(): void {
    this.optionCheckboxes.forEach(checkbox => {
      if (this.formGroup.value['choices'].includes(checkbox.nativeElement.value)) {
        checkbox.nativeElement.checked = true;
      }
    });
  }

  onNoneChanged() {
    if (this.isNoneOrInconnuSelected) {
      this.clearChoices();
    }

    this.formGroup.markAsPristine();
  }

  onOptionChanged(value: string, checked: boolean) {
    if (checked) {
      this.choicesControl.push(new UntypedFormControl(value));
    } else {
      this.choicesControl.controls.forEach((ctrl: UntypedFormControl, index: number) => {
        if (ctrl.value === value) {
          this.choicesControl.removeAt(index);
        }
      });
    }

    this.formGroup.markAsDirty();
  }

  private clearChoices() {
    const choicesArray = this.choicesControl;
    while (choicesArray.length !== 0) {
      choicesArray.removeAt(0);
    }
    this.optionCheckboxes.forEach(checkbox => {
      checkbox.nativeElement.checked = false;
    });
  }

  get formGroup() {
    return this.form.controls[this.question.key] as UntypedFormGroup;
  }

  get isValid() {
    return this.form.controls[this.question.key].pristine ||
           this.form.controls[this.question.key].valid;
  }

  private get choicesControl() {
    return this.formGroup.controls['choices'] as UntypedFormArray;
  }

  get isNoneOrInconnuSelected() {
    return this.formGroup.value['hasSome'] !== 'OUI';
  }
}
