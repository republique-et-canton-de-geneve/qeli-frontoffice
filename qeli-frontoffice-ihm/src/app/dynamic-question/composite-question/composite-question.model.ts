import { QuestionVisitorModel } from '../model/question-visitor.model';
import { Question, QuestionSchema } from '../model/question.model';
import { Answer } from '../model/answer.model';
import { AbstractControl, FormGroup } from '@angular/forms';
import { AnswerVisitor } from '../model/answer-visitor.model';

export const COMPOSITE_CONTROL_TYPE = 'composite';

/**
 * Le schema d'une réponse à une question de type {@link CompositeQuestionSchema}.
 */
export interface CompositeAnswerSchema {
  answers: { [key: string]: Answer };
}

/**
 * La réponse à une question de type {@link CompositeQuestionSchema}.
 */
export class CompositeAnswer extends Answer {
  type = COMPOSITE_CONTROL_TYPE;
  /**
   * Les réponses à toutes les questions qui compose cette question multiple.
   */
  answers: { [key: string]: Answer };

  constructor(options: CompositeAnswerSchema) {
    super();
    this.answers = options.answers;
  }

  accept<E>(visitor: AnswerVisitor<E>): E {
    return visitor.visitCompositeAnswer(this);
  }
}

/**
 * Un modèle représentant une question qui fait partir d'une aggregation des questions.
 */
export interface CompositeItem {
  /**
   * La question.
   */
  question: Question<any>;
  /**
   * Un callback pour déterminer si une question doit être montrée ou pas à partir des données déjà saisie dans
   * son group. Quand une question n'est pas montrée elle est aussi désactivé, elle n'est pas valide et les données
   * saisies ne sont pas prise en compte dans la réponse.
   *
   * @param value es données saisies dans le group.
   */
  isShown?: (value: any) => boolean;
}

/**
 * Le schema d'une question multiple.
 */
export interface CompositeQuestionSchema extends QuestionSchema {
  items: CompositeItem[];
}

/**
 * Une question multiple permettant d'aggregées plusieurs questions sur le même composant. Les questions peuvent
 * interagir entre elles de façon limité et leur réponses sont agrégés  dans le résultat.
 */
export class CompositeQuestion extends Question<CompositeAnswer> {
  controlType = COMPOSITE_CONTROL_TYPE;
  /**
   * Les questions qui composent cette question multiple.
   */
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
