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

import { Component, Input, OnInit } from '@angular/core';
import { RegisterQuestionComponent } from '../model/question-registry.model';
import { COMPOSITE_CONTROL_TYPE, CompositeAnswer, CompositeQuestion } from './composite-question.model';
import { QuestionComponent } from '../model/question.component';
import { UntypedFormGroup } from '@angular/forms';

@RegisterQuestionComponent(COMPOSITE_CONTROL_TYPE)
@Component({
  selector: 'app-composite-question',
  templateUrl: './composite-question.component.html',
  styleUrls: ['./composite-question.component.scss']
})
export class CompositeQuestionComponent implements QuestionComponent<CompositeAnswer>, OnInit {
  @Input() question: CompositeQuestion;
  @Input() form: UntypedFormGroup;
  @Input() disableFocusOnInit: boolean;

  ngOnInit(): void {
    this.updateControls();
    this.form.valueChanges.subscribe(() => this.updateControls());
  }

  private updateControls() {
    const formGroup = this.formGroup;
    this.question.items.filter(items => items.isShown).forEach(item => {
      const controls = formGroup.controls[item.question.key];
      if (!controls.enabled && item.isShown(this.form.value)) {
        controls.markAsPristine();
        controls.enable();
      } else if (!controls.disabled && !item.isShown(this.form.value)) {
        controls.disable();
      }
    });
  }

  get formGroup() {
    return this.form.controls[this.question.key] as UntypedFormGroup;
  }
}
