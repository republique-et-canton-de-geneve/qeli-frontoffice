import { Type } from '@angular/core';
import { QuestionComponent } from './question.component';

export const QuestionRegistryModel: { [key: string]: Type<QuestionComponent<any>> } = {};

export function RegisterQuestionComponent(name: string) {
  return function (component: Type<QuestionComponent<any>>) {
    QuestionRegistryModel[name] = component;
  }
}
