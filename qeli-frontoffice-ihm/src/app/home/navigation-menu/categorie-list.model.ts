import { Question } from '../../dynamic-question/model/question.model';

export interface CategorieListNode {
  name: string;
  collapsed: boolean;
  questions: Question<any>[];
}
