import { QuestionBase } from '../question-base.model';
import { QuestionVisitor } from '../question-visitor';

export class TextQuestion extends QuestionBase<string> {
  controlType = 'text';
  placeholder: string;
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
    this.placeholder = options['placeholder'] || '';
  }

  accept<E>(visitor: QuestionVisitor<E>): E {
    return visitor.visitTextQuestion(this);
  }
}
