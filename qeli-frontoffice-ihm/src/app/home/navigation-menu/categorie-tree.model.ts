import { Question } from '../../dynamic-question/model/quesiton.model';

export interface CategorieTree {
  name: string,
  collapsed: boolean;
  subcategories: SubcategorieTree[];
}

export interface SubcategorieTree {
  name: string;
  collapsed: boolean;
  questions: Question<any>[];
}