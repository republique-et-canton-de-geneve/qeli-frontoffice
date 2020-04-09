import { AnswerVisitor } from './answer-visitor.model';
import { QuestionOption } from './question.model';

/**
 * Un modèle représentant la réponse de l'utilistateur à une question.
 */
export abstract class Answer {
  type: string;

  /**
   * Accepte le visiteur donné et exécute la fonction de visite pour ce type de réponse.
   *
   * @param visitor le visiteur.
   */
  abstract accept<E>(visitor: AnswerVisitor<E>): E;
}

/**
 * Le schema d'une réponse simple.
 */
export interface SimpleAnswerSchema<T> {
  /**
   * La valeur ce cette réponse.
   */
  value: T;
}

/**
 * Une réponse simple qui contient du texte.
 */
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

/**
 * Une réponse simple qui contient un nombre.
 */
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

/**
 * Une réponse simple qui contient une option.
 */
export class OptionAnswer<T> extends Answer {
  type = "option";
  value: QuestionOption<T>;

  constructor(options: SimpleAnswerSchema<QuestionOption<T>>) {
    super();
    this.value = options.value;
  }

  accept<E>(visitor: AnswerVisitor<E>): E {
    return visitor.visitOptionAnswer(this);
  }
}
