import { Component, Input } from '@angular/core';
import { CategorieTree, SubcategorieTree } from './categorie-tree.model';
import { FormatAnswerVisitor } from '../../dynamic-question/model/format-answer.visitor';
import { FormData, Question } from '../../dynamic-question/model/quesiton.model';
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
  categorieTree: CategorieTree[] = [];
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

      this.categorieTree = this.toCategorieTree(this._qeliStateMachine);
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

  private toCategorieTree(stateMachine: QeliStateMachine) {
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
      let categorie: CategorieTree, subcategorie: SubcategorieTree;

      categorie = result.find(item => item.name === questionDecorator.categorie);

      if (!categorie) {
        categorie = {
          name: questionDecorator.categorie,
          collapsed: (currentQuestion) ? currentQuestion.categorie !== questionDecorator.categorie : true,
          subcategories: []
        };

        result.push(categorie);
      }

      subcategorie = categorie.subcategories.find(item => item.name === questionDecorator.subcategorie);

      if (!subcategorie) {
        subcategorie = {
          name: questionDecorator.subcategorie,
          collapsed: (currentQuestion) ? currentQuestion.subcategorie !== questionDecorator.subcategorie : true,
          questions: []
        };
        categorie.subcategories.push(subcategorie);
      }

      subcategorie.questions.push(questionDecorator.question);

      return result;
    }, []);
  }

  getAnswerForQuestion(question: Question<any>) {
    return this.reponses[question.key].accept(new FormatAnswerVisitor(this.translate));
  }
}
