import { QuestionVisitorModel } from '../model/question-visitor.model';
import { Question, QuestionOption, QuestionSchema } from '../model/question.model';
import { Answer } from '../model/answer.model';
import { AnswerVisitor } from '../model/answer-visitor.model';
import { AbstractControl, FormControl, FormGroup, ValidatorFn } from '@angular/forms';

/**
 * Un string identifiant les questions et réponses de type dropdown.
 */
export const DROPDOWN_CONTROL_TYPE = 'dropdown';

export interface DropdownAnswerSchema {
  hasSome?: QuestionOption<'OUI' | 'INCONNU'>;
  value: QuestionOption<string>;
}

export class DropdownAnswer extends Answer {
  type = DROPDOWN_CONTROL_TYPE;
  hasSome?: QuestionOption<'OUI' | 'INCONNU'>;
  value: QuestionOption<string>;

  constructor(options: DropdownAnswerSchema) {
    super();
    this.hasSome = options.hasSome;
    this.value = options.value;
  }

  accept<E>(visitor: AnswerVisitor<E>): E {
    return visitor.visitDropdownAnswer(this);
  }
}

export interface DropdownQuestionSchema extends QuestionSchema {
  /**
   * S'il y a des options pour indiquer qu’aucun choix ne satisfait pas l'utilistauer ou ne réponds pas à la question
   * pour son cas.
   */
  someOptions?: QuestionOption<'OUI' | 'INCONNU'>[];
  /**
   * La liste des choix.
   */
  dropdownOptions: QuestionOption<string>[];
}

export class DropdownQuestion extends Question<DropdownAnswer> {
  controlType = DROPDOWN_CONTROL_TYPE;
  someOptions: QuestionOption<'OUI' | 'INCONNU'>[];
  dropdownOptions: QuestionOption<string>[];

  constructor(options: DropdownQuestionSchema) {
    super(options);
    this.someOptions = options.someOptions;
    this.dropdownOptions = options.dropdownOptions || [];
  }

  protected requiredValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      if (control && control.value) {
        const optionSelected = !!control.value['value'];
        const isInconnuSelected = (this.hasInconnu) && control.value['hasSome'] !== 'OUI';
        return !optionSelected && !isInconnuSelected ? {'required': true} : null;
      }

      return null;
    };
  }

  toFormControl(defaultValue: DropdownAnswer): AbstractControl {
    let group: any = {};

    if (this.hasInconnu) {
      group['hasSome'] = new FormControl(defaultValue ? defaultValue.hasSome.value : 'OUI');
    }

    const selectedOption = defaultValue ? defaultValue.value : null;
    group['value'] = selectedOption.value;

    return new FormGroup(group, this.validators);
  }

  accept<E>(visitor: QuestionVisitorModel<E>): E {
    return visitor.visitDropdownQuestion(this);
  }

  /**
   * Quand au moins un des choix réponds à la question pour l'utilistateur, cette option est cochée.
   */
  get someOption() {
    return this.findHasSomeOptionByKey('OUI');
  }

  /**
   * si elle existe, l'option pour indiquer que l'utilisateur ne connais pas la réponse à la question en ce moment.
   */
  get inconnuOption() {
    return this.findHasSomeOptionByKey('INCONNU');
  }


  /**
   * Si l'option 'Je ne sais pas' existe.
   */
  get hasInconnu() {
    return !!this.inconnuOption;
  }

  /**
   * Retrouve une option rapide par sa clef.
   *
   * @param key la clé pour l'option recherchée.
   */
  findHasSomeOptionByKey(key: 'OUI' | 'INCONNU') {
    return this.someOptions.find(option => option.value === key);
  }
}
