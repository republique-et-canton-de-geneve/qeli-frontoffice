import { FormGroup } from '@angular/forms';
import { Question } from './question.model';
import { Answer } from './answer.model';

export interface QuestionComponent<T extends Answer> {
  question: Question<T>;
  form: FormGroup;
  disableFocusOnInit: boolean;
}
