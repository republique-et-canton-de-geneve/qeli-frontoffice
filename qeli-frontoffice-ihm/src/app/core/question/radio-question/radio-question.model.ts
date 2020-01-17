import { QuestionBase } from '../question-base.model';

export class RadioQuestion extends QuestionBase<string> {
  controlType = 'radio';
  options: string[];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }
}
