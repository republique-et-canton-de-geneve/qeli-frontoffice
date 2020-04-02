import { AnswerVisitor } from './answer-visitor.model';
import { QuestionOption } from './quesiton.model';
import { CHECKBOX_GROUP_CONTROL_TYPE } from '../checkbox-group-question/checkbox-group-question.model';

/**
 * Un modèle représentant la réponse de l'utilistateur à une question.
 */
export abstract class Answer {
  /**
   * Accepte le visiteur donné et exécute la fonction de visite pour ce type de réponse.
   *
   * @param visitor le visiteur.
   */
  abstract accept<E>(visitor: AnswerVisitor<E>): E;
}

export class StringAnswer extends Answer {
  type = "string";
  value: string;

  constructor(value: string) {
    super();
    this.value = value;
  }

  accept<E>(visitor: AnswerVisitor<E>): E {
    return visitor.visitStringAnswer(this);
  }
}

export class NumberAnswer extends Answer {
  type = "number";
  value: number;

  constructor(value: number) {
    super();
    this.value = value;
  }

  accept<E>(visitor: AnswerVisitor<E>): E {
    return visitor.visitNumberAnswer(this);
  }
}

export class OptionAnswer<T> extends Answer {
  type = "option";
  option: QuestionOption<T>;

  constructor(option: QuestionOption<T>) {
    super();
    this.option = option;
  }

  accept<E>(visitor: AnswerVisitor<E>): E {
    return visitor.visitOptionAnswer(this);
  }
}
