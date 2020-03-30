import { QuestionVisitorModel } from '../model/question-visitor.model';
import { OptionQuestion, QuestionOption, QuestionSchema } from '../model/quesiton.model';

export const DROPDOWN_CONTROL_TYPE = 'dropdown';

export interface DropdownQuestionSchema extends QuestionSchema {
  dropdownOptions: QuestionOption<string>[];
}

export class DropdownQuestion extends OptionQuestion<string> {
  controlType = DROPDOWN_CONTROL_TYPE;
  dropdownOptions: QuestionOption<string>[];

  constructor(options: DropdownQuestionSchema) {
    super(options);
    this.dropdownOptions = options.dropdownOptions || [];
  }

  accept<E>(visitor: QuestionVisitorModel<E>): E {
    return visitor.visitDropdownQuestion(this);
  }
}
