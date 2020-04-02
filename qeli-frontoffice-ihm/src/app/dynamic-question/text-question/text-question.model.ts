import { QuestionVisitorModel } from '../model/question-visitor.model';
import { QuestionSchema, StringQuestion } from '../model/quesiton.model';
import { I18nString } from '../../core/i18n/i18nstring.model';

export const TEXT_CONTROL_TYPE = 'text';

export interface TextQuestionSchema extends QuestionSchema {
  placeholder?: I18nString;
  type?: string;
}

export class TextQuestion extends StringQuestion {
  controlType = TEXT_CONTROL_TYPE;
  placeholder: I18nString;
  type: string;

  constructor(options: TextQuestionSchema) {
    super(options);
    this.type = options.type || 'text';
    this.placeholder = options.placeholder || null;
  }

  accept<E>(visitor: QuestionVisitorModel<E>): E {
    return visitor.visitTextQuestion(this);
  }
}
