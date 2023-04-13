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

import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ToAnswerVisitor } from '../../dynamic-question/model/to-answer.visitor.model';
import { QeliStateMachine } from '../../service/question/qeli-state.model';
import { DynamicQuestionComponent } from '../../dynamic-question/dynamic-question.component';

@Component({
  selector: 'app-qeli-form',
  templateUrl: './qeli-form.component.html',
  styleUrls: ['./qeli-form.component.scss']
})
export class QeliFormComponent implements OnInit {

  @ViewChild('formElement') formElement: ElementRef;
  @ViewChild('dynamicQuestionComponent') dynamicQuestionComponent: DynamicQuestionComponent;

  @Input() qeliStateMachine: QeliStateMachine;
  @Input() disableDeepLink: boolean = false;

  form: UntypedFormGroup;

  constructor(private formBuilder: UntypedFormBuilder) {
  }

  ngOnInit() {
    const questions = this.qeliStateMachine.questions.map(decorator => decorator.question);
    const formData = this.qeliStateMachine.state.formData;

    let group: any = {};

    questions.forEach(question => {
      group[question.key] = question.toFormControl(formData ? formData[question.key] : null);
    });

    this.form = this.formBuilder.group(group);
  }

  isCurrentQuestionValid() {
    return this.form.controls[this.currentQuestion.key].valid;
  }

  get currentAnswer() {
    if (this.isCurrentQuestionValid()) {
      const currentQuestion = this.currentQuestion;
      return currentQuestion.accept(new ToAnswerVisitor(this.form.value, currentQuestion.key));
    }

    return null;
  }

  get currentQuestion() {
    const questionDecorator = this.qeliStateMachine.currentQuestion;
    return questionDecorator !== null ? questionDecorator.question : null;
  }

  displayErrors() {
    this.dynamicQuestionComponent.displayErrors();
  }
}
