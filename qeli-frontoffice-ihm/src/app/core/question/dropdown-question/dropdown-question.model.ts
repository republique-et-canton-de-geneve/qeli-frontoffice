import { QuestionBase } from '../question-base.model';

export class DropdownQuestion extends QuestionBase<string[]> {
  controlType = 'dropdown';
  options: string[];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }
}
