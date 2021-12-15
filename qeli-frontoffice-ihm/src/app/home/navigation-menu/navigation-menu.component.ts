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

import { Component, Input } from '@angular/core';
import { CategorieListNode } from './categorie-list.model';
import { FormatAnswerVisitor } from '../../dynamic-question/model/format-answer.visitor';
import { FormData, Question } from '../../dynamic-question/model/question.model';
import { TranslateService } from '@ngx-translate/core';
import { QeliQuestionDecorator } from '../../service/question/qeli-question-decorator.model';
import { QeliStateMachine } from '../../service/question/qeli-state.model';
import { Subscription } from 'rxjs';
import { TrackingService } from '../../service/tracking/tracking.service';

@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.scss']
})
export class NavigationMenuComponent {

  currentQuestion: QeliQuestionDecorator<any> = null;
  categorieList: CategorieListNode[] = [];
  progress: number = 0;
  reponses: FormData = {};
  navigationCollapsed: boolean = true;

  private _qeliStateMachine: QeliStateMachine;
  private _questionChangedSubscription: Subscription;

  constructor(private translate: TranslateService,
              private trackingService: TrackingService) {

  }

  updateNavigation() {
    if (this._qeliStateMachine) {
      const state = this._qeliStateMachine.state;
      const questions = this._qeliStateMachine.questions;

      this.categorieList = this.toCategorieList(this._qeliStateMachine);
      this.progress = state.done ? 100 : (state.currentQuestionIndex / (questions.length - 1)) * 100;
      this.currentQuestion = this._qeliStateMachine.currentQuestion;
      this.reponses = state.formData;
      this.navigationCollapsed = true;
    }
  }

  @Input()
  set qeliStateMachine(qeliStateMachine: QeliStateMachine) {
    if (this._questionChangedSubscription) {
      this._questionChangedSubscription.unsubscribe();
    }

    this._qeliStateMachine = qeliStateMachine;
    if (this._qeliStateMachine) {
      this._questionChangedSubscription = qeliStateMachine.onQuestionChangedEvent
                                                          .subscribe(this.updateNavigation.bind(this));
      this.updateNavigation();
    }
  }

  isCurrentQuestion(question: Question<any>) {
    return this.currentQuestion && this.currentQuestion.question.key === question.key;
  }

  selectQuestion(question: Question<any>) {
    if (!this.isCurrentQuestion(question)) {
      this._qeliStateMachine.navigateToQuestion(question);
      this.trackingService.trackQuestion(question);
      this.updateNavigation();
    }
  }

  private toCategorieList(stateMachine: QeliStateMachine) {
    const state = stateMachine.state;
    const questions = stateMachine.questions;

    let indexHistory = state.questionIndexHistory;
    let currentQuestion: QeliQuestionDecorator<any>;

    if (!state.done) {
      indexHistory = indexHistory.concat(state.currentQuestionIndex);
      currentQuestion = stateMachine.currentQuestion;
    }

    return indexHistory.reduce((result, current) => {
      const questionDecorator = questions[current];
      let categorie: CategorieListNode;

      categorie = result.find(item => item.name === questionDecorator.categorie);

      if (!categorie) {
        categorie = {
          name: questionDecorator.categorie,
          collapsed: (currentQuestion) ? currentQuestion.categorie !== questionDecorator.categorie : true,
          questions: []
        };

        result.push(categorie);
      }

      categorie.questions.push(questionDecorator.question);

      return result;
    }, []);
  }

  getAnswerForQuestion(question: Question<any>) {
    return this.reponses[question.key].accept(new FormatAnswerVisitor(this.translate));
  }
}
