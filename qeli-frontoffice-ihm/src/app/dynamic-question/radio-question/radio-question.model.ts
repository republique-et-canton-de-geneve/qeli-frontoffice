import { QuestionVisitorModel } from '../model/question-visitor.model';
import { OptionQuestion, QuestionOption, QuestionSchema } from '../model/question.model';

export const RADIO_CONTROL_TYPE = 'radio';

export interface RadioQuestionSchema extends QuestionSchema {
  inline?: boolean;
  radioOptions: QuestionOption<string>[];
}

export class RadioQuestion extends OptionQuestion<string> {
  controlType = RADIO_CONTROL_TYPE;
  inline: boolean;
  radioOptions: QuestionOption<string>[];

  constructor(options: RadioQuestionSchema) {
    super(options);
    this.radioOptions = options.radioOptions || [];
    this.inline = options.inline !== null && options.inline !== undefined ? options.inline : false;
  }

  accept<E>(visitor: QuestionVisitorModel<E>): E {
    return visitor.visitRadioQuestion(this);
  }
}
