import { QuestionBase } from '../question-base.model';
import { QuestionOption } from '../option.model';
import { QuestionVisitor } from '../question-visitor';

export class RadioQuestion extends QuestionBase<string> {
  controlType = 'radio';
  inline: boolean;
  options: QuestionOption[];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
    this.inline = !!options['inline'];
  }

  accept<E>(visitor: QuestionVisitor<E>): E {
    return visitor.visitRadioQuestion(this);
  }
}
