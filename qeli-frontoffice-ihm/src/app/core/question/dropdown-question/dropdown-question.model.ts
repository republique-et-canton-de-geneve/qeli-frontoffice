import { QuestionBase } from '../question-base.model';
import { QuestionVisitor } from '../question-visitor';

export class DropdownQuestion extends QuestionBase<string[]> {
  controlType = 'dropdown';
  options: string[];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }

  accept<E>(visitor: QuestionVisitor<E>): E {
    return visitor.visitDropdownQuestion(this);
  }
}
