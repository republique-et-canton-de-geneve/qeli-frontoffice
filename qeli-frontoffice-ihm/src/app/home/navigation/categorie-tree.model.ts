import { QuestionBase } from '../../core/question/question-base.model';

export interface CategorieTree {
  name: string,
  collapsed: boolean;
  subcategories: SubcategorieTree[];
}

export interface SubcategorieTree {
  name: string;
  collapsed: boolean;
  questions: QuestionBase<any>[];
}
