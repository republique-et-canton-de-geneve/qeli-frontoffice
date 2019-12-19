import { QuestionBase } from './question-base.model';

export class TextQuestion extends QuestionBase<string> {
  controlType = 'textbox';
  placeholder: string;
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
    this.placeholder = options['placeholder'] || '';
  }
}
