import { AbstractControl, FormArray, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { Pays } from './pays.model';
import { QuestionVisitorModel } from '../model/question-visitor.model';
import { Question, QuestionOption, QuestionSchema } from '../model/quesiton.model';
import { Answer } from '../model/answer.model';
import { AnswerVisitor } from '../model/answer-visitor.model';

export const NATIONALITE_CONTROL_TYPE = 'nationalite';

export interface NationaliteAnswerSchema {
  pays: QuestionOption<Pays>[];
  apatride: boolean;
}

export class NationaliteAnswer extends Answer {
  type = NATIONALITE_CONTROL_TYPE;
  pays: QuestionOption<Pays>[];
  apatride: boolean;

  constructor(options: NationaliteAnswerSchema) {
    super();
    this.pays = options.pays;
    this.apatride = options.apatride;
  }

  accept<E>(visitor: AnswerVisitor<E>): E {
    return visitor.visitNationaliteAnswer(this);
  }
}

export class NationaliteQuestion extends Question<NationaliteAnswer> {
  controlType = NATIONALITE_CONTROL_TYPE;
  paysOptions: QuestionOption<Pays>[];

  constructor(options: QuestionSchema) {
    super(options);

    this.paysOptions = Object.values(Pays).map(pays => ({
      value: pays,
      label: {key: `common.pays.${pays}`}
    }));
  }

  protected requiredValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      if (control.value['apatride'] !== true &&
          (!control.value['pays'] || (control.value['pays'] as string[]).every(e => !e))
      ) {
        return {'required': true}
      } else {
        return null;
      }
    };
  }

  toFormControl(defaultValue: NationaliteAnswer): AbstractControl {
    let group: any = {};

    group['apatride'] = new FormControl(defaultValue ? defaultValue.apatride : false);
    group['pays'] = new FormArray(
      defaultValue && defaultValue.pays ? defaultValue.pays.map(pay => new FormControl(pay)) : [new FormControl()]
    );

    return new FormGroup(group, this.validators);
  }

  accept<E>(visitor: QuestionVisitorModel<E>): E {
    return visitor.visitNationaliteQuestion(this);
  }
}

