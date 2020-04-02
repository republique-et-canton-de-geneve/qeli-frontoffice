import { AnswerVisitor } from './answer-visitor.model';
import { QuestionOption } from './question.model';

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

export interface SimpleAnswerSchema<T> {
  value: T;
}

export class StringAnswer extends Answer {
  type = "string";
  value: string;

  constructor(options: SimpleAnswerSchema<string>) {
    super();
    this.value = options.value;
  }

  accept<E>(visitor: AnswerVisitor<E>): E {
    return visitor.visitStringAnswer(this);
  }
}

export class NumberAnswer extends Answer {
  type = "number";
  value: number;

  constructor(options: SimpleAnswerSchema<number>) {
    super();
    this.value = options.value;
  }

  accept<E>(visitor: AnswerVisitor<E>): E {
    return visitor.visitNumberAnswer(this);
  }
}

export interface OptionAnswerSchema<T> {
  value: QuestionOption<T>;
}

export class OptionAnswer<T> extends Answer {
  type = "option";
  value: QuestionOption<T>;

  constructor(options: OptionAnswerSchema<T>) {
    super();
    this.value = options.value;
  }

  accept<E>(visitor: AnswerVisitor<E>): E {
    return visitor.visitOptionAnswer(this);
  }
}
