import { AbstractControl, FormArray, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { Question, QuestionOption, QuestionSchema } from '../model/quesiton.model';
import { Answer } from '../model/answer.model';
import { AnswerVisitor } from '../model/answer-visitor.model';
import { QuestionVisitorModel } from '../model/question-visitor.model';
import { I18nString } from '../../core/i18n/i18nstring.model';

export const CHECKBOX_GROUP_CONTROL_TYPE = 'checkbox-group';

export interface CheckboxGroupAnswerSchema {
  none?: QuestionOption<'OUI' | 'NON' | 'INCONNU'>;
  choices?: QuestionOption<string>[];
}

export class CheckboxGroupAnswer extends Answer {
  none?: QuestionOption<'OUI' | 'NON' | 'INCONNU'>;
  choices: QuestionOption<string>[];

  constructor(options: CheckboxGroupAnswerSchema) {
    super();
    this.none = options.none || null;
    this.choices = options.choices || [];
  }

  accept<E>(visitor: AnswerVisitor<E>): E {
    return visitor.visitCheckboxGroupAnswer(this);
  }
}

export interface CheckboxGroup {
  label: I18nString;
  options: QuestionOption<string>[];
}

export interface CheckboxGroupQuestionSchema extends QuestionSchema {
  checkboxOptions: (QuestionOption<string> | CheckboxGroup)[];
  noneOptions?: QuestionOption<'OUI' | 'NON' | 'INCONNU'>[];
}

export class CheckboxGroupQuestion extends Question<CheckboxGroupAnswer> {
  controlType = CHECKBOX_GROUP_CONTROL_TYPE;
  noneOptions: QuestionOption<'OUI' | 'NON' | 'INCONNU'>[];
  checkboxOptions: (QuestionOption<string> | CheckboxGroup)[];

  constructor(options: CheckboxGroupQuestionSchema) {
    super(options);
    this.checkboxOptions = options.checkboxOptions || [];
    this.noneOptions = options.noneOptions || [];
  }

  protected requiredValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      if (control && control.value) {
        const atLeastOneOption = this.listOfOptions.some(option => control.value['choices'].includes(option.value));
        const isNoneSelected = (this.hasNone || this.hasInconnu) && control.value['none'] !== 'NON';
        return !atLeastOneOption && !isNoneSelected ? {'atLeastOneSelected': true} : null;
      }

      return null;
    };
  }

  toFormControl(defaultValue: CheckboxGroupAnswer): AbstractControl {
    let group: any = {};

    if (this.hasNone || this.hasInconnu) {
      group['none'] = new FormControl(defaultValue ? defaultValue.none.value : 'NON');
    }

    const defaultChoices = defaultValue ? defaultValue.choices || [] : [];
    group['choices'] = new FormArray(defaultChoices.map(choice => new FormControl(choice.value)));

    return new FormGroup(group, this.validators);
  }

  accept<E>(visitor: QuestionVisitorModel<E>): E {
    return visitor.visitCheckboxGroupQuestion(this);
  }

  get someOption() {
    return this.findNoneOptionByKey('NON');
  }

  get noneOption() {
    return this.findNoneOptionByKey('OUI');
  }

  get inconnuOption() {
    return this.findNoneOptionByKey('INCONNU');
  }

  get hasNone() {
    return this.noneOption !== null;
  }

  get hasInconnu() {
    return this.inconnuOption !== null;
  }

  findNoneOptionByKey(key: 'OUI' | 'NON' | 'INCONNU') {
    return this.noneOptions.find(option => option.value === key);
  }

  get listOfOptions(): QuestionOption<string>[] {
    return this.checkboxOptions.map(
      optionOrGroup => optionOrGroup.hasOwnProperty('options') ?
                       (optionOrGroup as CheckboxGroup).options : [optionOrGroup as QuestionOption<string>]
    ).reduce((current, result) => result.concat(current), []);
  }
}
