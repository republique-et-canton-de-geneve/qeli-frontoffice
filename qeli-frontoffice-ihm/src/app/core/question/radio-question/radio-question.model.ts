import { QuestionBase } from '../question-base.model';

export class RadioQuestion extends QuestionBase<string> {
  controlType = 'radio';
  inline: boolean;
  options: string[];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
    this.inline = !!options['inline'];
  }
}
