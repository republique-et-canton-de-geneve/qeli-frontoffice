import { QuestionBase } from './question-base.model';
import { FormGroup } from '@angular/forms';

export interface QuestionComponent<T> {
  question: QuestionBase<T>;
  form: FormGroup;
}
