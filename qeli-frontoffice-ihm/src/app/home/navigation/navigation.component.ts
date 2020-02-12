import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormState } from '../../core/common/form-state.model';
import { QuestionBase } from '../../core/question/question-base.model';
import { CategorieTree } from './categorie-tree.model';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  @Input() questions: QuestionBase<any>[] = [];
  @Output() onQuestionSelected: EventEmitter<QuestionBase<any>> = new EventEmitter();

  categorieTree: CategorieTree[] = [];
  currentQuestion: QuestionBase<any>;
  progress: number = 0;
  reponses: any;

  navigationCollapsed: boolean = true;

  @Input()
  set formState(formState: FormState) {
    if (formState) {
      this.categorieTree = this.toCategorieTree(formState);
      this.progress = formState.done ? 100 : (formState.currentIndex / (this.questions.length - 1)) * 100;
      this.currentQuestion = (!formState.done) ? this.questions[formState.currentIndex] : null;
      this.reponses = formState.data;
      this.navigationCollapsed = true;
    }
  }

  isCurrentQuestion(question: QuestionBase<any>) {
    return this.currentQuestion && this.currentQuestion.code === question.code;
  }

  selectQuestion(question: QuestionBase<any>) {
    if (!this.isCurrentQuestion(question)) {
      this.onQuestionSelected.emit(question);
    }
  }

  private toCategorieTree(formState: FormState) {
    let indexHistory = formState.indexHistory;
    let currentQuestion: QuestionBase<any>;

    if (!formState.done) {
      indexHistory = indexHistory.concat(formState.currentIndex);
      currentQuestion = this.questions[formState.currentIndex];
    }

    return indexHistory.reduce((result, current) => {
      const question = this.questions[current];
      let categorie, subcategorie;

      categorie = result.find(item => item.name === question.categorie);

      if (!categorie) {
        categorie = {
          name: question.categorie,
          collapsed: (currentQuestion) ? currentQuestion.categorie !== question.categorie : true,
          subcategories: []
        };

        result.push(categorie);
      }

      subcategorie = categorie.subcategories.find(item => item.name === question.subcategorie);

      if (!subcategorie) {
        subcategorie = {
          name: question.subcategorie,
          collapsed: (currentQuestion) ? currentQuestion.subcategorie !== question.subcategorie : true,
          questions: []
        };
        categorie.subcategories.push(subcategorie);
      }

      subcategorie.questions.push(question);

      return result;
    }, []);
  }

}
