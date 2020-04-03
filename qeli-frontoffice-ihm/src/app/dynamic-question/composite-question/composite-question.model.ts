import { QuestionVisitorModel } from '../model/question-visitor.model';
import { Question, QuestionSchema } from '../model/question.model';
import { Answer } from '../model/answer.model';
import { AbstractControl, FormGroup } from '@angular/forms';
import { AnswerVisitor } from '../model/answer-visitor.model';

export const COMPOSITE_CONTROL_TYPE = 'composite';

export interface CompositeAnswerSchema {
  answers: { [key: string]: Answer };
}

export class CompositeAnswer extends Answer {
  answers: { [key: string]: Answer };

  constructor(options: CompositeAnswerSchema) {
    super();
    this.answers = options.answers;
  }

  accept<E>(visitor: AnswerVisitor<E>): E {
    return visitor.visitCompositeAnswer(this);
  }
}

export interface CompositeItem {
  question: Question<any>;
  isShown?: (value: any) => boolean;
}

export interface CompositeQuestionSchema extends QuestionSchema {
  items: CompositeItem[];
}

export class CompositeQuestion extends Question<CompositeAnswer> {
  controlType = COMPOSITE_CONTROL_TYPE;
  items: CompositeItem[];

  constructor(options: CompositeQuestionSchema) {
    super(options);
    this.items = options.items;
  }

  accept<E>(visitor: QuestionVisitorModel<E>): E {
    return visitor.visitCompositeQuestion(this);
  }

  toFormControl(defaultValue?: CompositeAnswer): AbstractControl {
    let group: any = {};

    this.items.map(item => item.question).forEach(question => {
      group[question.key] = question.toFormControl(defaultValue ? defaultValue.answers[question.key] : null);

    });

    return new FormGroup(group, this.validators);
  }
}
