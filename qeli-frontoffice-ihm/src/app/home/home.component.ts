import { Component } from '@angular/core';
import { QuestionBase } from '../core/question/question-base.model';
import { AllQuestions } from './question.configuration';
import { FormState } from '../core/dynamic-form/form-state.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  questions: QuestionBase<any>[] = AllQuestions;
  formState: FormState;
}
