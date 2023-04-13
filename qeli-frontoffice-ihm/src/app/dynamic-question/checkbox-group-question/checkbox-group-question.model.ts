/*
 * qeli-frontoffice
 *
 * Copyright (C) 2019-2021 Republique et canton de Geneve
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { AbstractControl, UntypedFormArray, UntypedFormControl, UntypedFormGroup, ValidatorFn } from '@angular/forms';
import { Question, QuestionOption, QuestionSchema } from '../model/question.model';
import { Answer } from '../model/answer.model';
import { AnswerVisitor } from '../model/answer-visitor.model';
import { QuestionVisitorModel } from '../model/question-visitor.model';
import { I18nString } from '../../core/i18n/i18nstring.model';

/**
 * Un string identifiant les questions et réponses de type checkbox group.
 */
export const CHECKBOX_GROUP_CONTROL_TYPE = 'checkbox-group';

/**
 * Le schema d'une réponse à la question de type {@link CheckboxGroupQuestion}.
 */
export interface CheckboxGroupAnswerSchema {
  /**
   * 'NON' ou 'INCONNU' si aucun choix ne satisfait la question.
   */
  hasSome?: QuestionOption<'OUI' | 'NON' | 'INCONNU'>;
  /**
   * Les choix de l'utilisteur.
   */
  choices?: QuestionOption<string>[];
}

/**
 * La réponse à une question de type {@link CheckboxGroupQuestion}.
 */
export class CheckboxGroupAnswer extends Answer {
  type = CHECKBOX_GROUP_CONTROL_TYPE;
  /**
   * 'NON' ou 'INCONNU' si aucun choix ne satisfait la question.
   */
  hasSome?: QuestionOption<'OUI' | 'NON' | 'INCONNU'>;
  /**
   * Les choix de l'utilisteur.
   */
  choices: QuestionOption<string>[];

  constructor(options: CheckboxGroupAnswerSchema) {
    super();
    this.hasSome = options.hasSome || null;
    this.choices = options.choices || [];
  }

  accept<E>(visitor: AnswerVisitor<E>): E {
    return visitor.visitCheckboxGroupAnswer(this);
  }
}

/**
 * Un modèle représentant un regroupement d'option sous un même titre.
 */
export interface CheckboxGroup {
  /**
   * Le titre de ce group de choix.
   */
  label: I18nString;
  /**
   * Les choix possible de ce group.
   */
  options: QuestionOption<string>[];
}

/**
 * Le schema d'une question qui permet un choix de multiple options.
 */
export interface CheckboxGroupQuestionSchema extends QuestionSchema {
  /**
   * S'il y a des options pour indiquer qu’aucun choix ne satisfait pas l'utilistauer ou ne réponds pas à la question
   * pour son cas.
   */

  hasSomeOptions?: QuestionOption<'OUI' | 'NON' | 'INCONNU'>[];
  /**
   * L'option séléctionné par défaut.
   */
  someOptionInitValue?: 'OUI' | 'NON' | 'INCONNU';

  /**
   * La liste des choix, sois des choix simples, sois des choix regroupés.
   */
  checkboxOptions: (QuestionOption<string> | CheckboxGroup)[];
}

/**
 * Une question qui permet un choix de multiple options.
 */
export class CheckboxGroupQuestion extends Question<CheckboxGroupAnswer> {
  controlType = CHECKBOX_GROUP_CONTROL_TYPE;
  /**
   * S'il y a des options pour indiquer qu’aucun choix ne satisfait pas l'utilistauer ou ne réponds pas à la question
   * pour son cas.
   */
  hasSomeOptions: QuestionOption<'OUI' | 'NON' | 'INCONNU'>[];

  /**
   * L'option séléctionné par défaut.
   */
  someOptionInitValue: 'OUI' | 'NON' | 'INCONNU';

  /**
   * La liste des choix, sois des choix simples, sois des choix regroupés.
   */
  checkboxOptions: (QuestionOption<string> | CheckboxGroup)[];

  constructor(options: CheckboxGroupQuestionSchema) {
    super(options);
    this.checkboxOptions = options.checkboxOptions || [];
    this.hasSomeOptions = options.hasSomeOptions || [];
    this.someOptionInitValue = options.someOptionInitValue || 'OUI';
  }

  protected requiredValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      if (control && control.value) {
        const atLeastOneOption = this.listOfOptions.some(option => control.value['choices'].includes(option.value));
        const isNoneSelected = (this.hasNone || this.hasInconnu) && control.value['hasSome'] !== 'OUI';
        return !atLeastOneOption && !isNoneSelected ? {'atLeastOneSelected': true} : null;
      }

      return null;
    };
  }

  toFormControl(defaultValue: CheckboxGroupAnswer): AbstractControl {
    let group: any = {};

    if (this.hasNone || this.hasInconnu) {
      group['hasSome'] = new UntypedFormControl(defaultValue ? defaultValue.hasSome.value : this.someOptionInitValue);
    }

    const defaultChoices = defaultValue ? defaultValue.choices || [] : [];
    group['choices'] = new UntypedFormArray(defaultChoices.map(choice => new UntypedFormControl(choice.value)));

    return new UntypedFormGroup(group, this.validators);
  }

  accept<E>(visitor: QuestionVisitorModel<E>): E {
    return visitor.visitCheckboxGroupQuestion(this);
  }

  /**
   * Quand au moins un des choix réponds à la question pour l'utilistateur, cette option est cochée.
   */
  get someOption() {
    return this.findHasSomeOptionByKey('OUI');
  }

  /**
   * Si elle existe, l'option pour indiquer qu’aucun choix n'est satisfait pas la question pour l'utilisateur.s
   */
  get noneOption() {
    return this.findHasSomeOptionByKey('NON');
  }

  /**
   * si elle existe, l'option pour indiquer que l'utilisateur ne connais pas la réponse à la question en ce moment.
   */
  get inconnuOption() {
    return this.findHasSomeOptionByKey('INCONNU');
  }

  /**
   * Si une l'option 'Aucun des choix précédentes' existe.
   */
  get hasNone() {
    return !!this.noneOption;
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
  findHasSomeOptionByKey(key: 'OUI' | 'NON' | 'INCONNU') {
    return this.hasSomeOptions.find(option => option.value === key);
  }

  /**
   * La liste avec toutes les options qu'elles fassent partie d'un sub-group ou pas.
   */
  get listOfOptions(): QuestionOption<string>[] {
    return this.checkboxOptions.map(
      optionOrGroup => optionOrGroup.hasOwnProperty('options') ?
                       (optionOrGroup as CheckboxGroup).options : [optionOrGroup as QuestionOption<string>]
    ).reduce((current, result) => result.concat(current), []);
  }
}
