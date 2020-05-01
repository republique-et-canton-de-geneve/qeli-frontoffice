import { QuestionVisitorModel } from '../model/question-visitor.model';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Question, QuestionSchema } from '../model/question.model';
import { Answer } from '../model/answer.model';
import { AnswerVisitor } from '../model/answer-visitor.model';

export const TAUX_CONTROL_TYPE = 'taux';

export interface TauxAnswerSchema {
  value: number;
  other?: boolean;
}

export class TauxAnswer extends Answer {
  value: number;
  other: boolean;

  constructor(options: TauxAnswerSchema) {
    super();
    this.value = options.value;
    this.other = !!options.other;
  }

  accept<E>(visitor: AnswerVisitor<E>): E {
    return visitor.visitTauxAnswer(this);
  }
}

export class TauxQuestion extends Question<TauxAnswer> {
  controlType = TAUX_CONTROL_TYPE;

  constructor(options: QuestionSchema) {
    super(options);
  }

  protected requiredValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      if (control && control.value) {
        return control.value['value'] === null || control.value['value'] === undefined ? {'required': true} : null;
      }

      return null;
    };
  }

  accept<E>(visitor: QuestionVisitorModel<E>): E {
    return visitor.visitTauxQuestion(this);
  }

  toFormControl(defaultValue: TauxAnswer): AbstractControl {
    let group: any = {};

    group['value'] = new FormControl(
      defaultValue ? defaultValue.value : null,
      [Validators.max(100), Validators.min(0), Validators.pattern(/-?\d+(,\d+)?/)]
    );
    group['other'] = new FormControl(defaultValue ? defaultValue.other : false);

    return new FormGroup(group, this.validators);
  }
}
