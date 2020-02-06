import { Component, Input } from '@angular/core';
import { FormState } from '../../core/dynamic-form/form-state.model';
import { QuestionBase } from '../../core/question/question-base.model';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  @Input() formState: FormState;
  @Input() questions: QuestionBase<any>[] = [];

  navigationCollapsed: boolean = true;

  get questionsAsTree() {
    let indexHistory = this.formState.indexHistory;

    if (!this.formState.done) {
      indexHistory = indexHistory.concat(this.formState.currentIndex);
    }

    return indexHistory.reduce((result, current) => {
      const question = this.questions[current];
      let categorie, subcategorie;

      categorie = result.find(item => item.name === question.categorie);

      if (!categorie) {
        categorie = {
          name: question.categorie,
          subcategories: []
        };

        result.push(categorie);
      }

      subcategorie = categorie.subcategories.find(item => item.name === question.subcategorie);

      if (!subcategorie) {
        subcategorie = {
          name: question.subcategorie,
          questions: []
        };
        categorie.subcategories.push(subcategorie);
      }

      subcategorie.questions.push(question);

      return result;
    }, []);
  }

  get progress() {
    return this.formState.done ? 100 : (this.formState.currentIndex / (this.questions.length - 1)) * 100;
  }
}
