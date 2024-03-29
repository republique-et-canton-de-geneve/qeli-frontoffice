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

import { AbstractControl, UntypedFormControl, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Answer, OptionAnswer, StringAnswer } from './answer.model';
import { QuestionVisitorModel } from './question-visitor.model';
import { I18nString } from '../../core/i18n/i18nstring.model';

/**
 * Les réponses du formulaire en clé valeur. La clé de chaque élément correspond à une clé de question.
 */
export interface FormData {
  [key: string]: Answer;
}

export interface QuestionSchema {
  key: string;
  required?: boolean;
  showErrors?: boolean;
  dataCyIdentifier: string;
  label: I18nString | ((value: any) => I18nString);
  help?: I18nString | ((value: any) => I18nString);
  introduction?: I18nString | ((value: any) => I18nString);
  extraHelp?: I18nString | ((value: any) => I18nString);
  errorLabels?: { [key: string]: I18nString };
  onValueChanged?: (control: UntypedFormGroup) => void;
  validators?: ValidatorFn[];
}

/**
 * Un modèle représentant une question du formulaire d'éligbilité.
 */
export abstract class Question<T extends Answer> {
  /**
   * Un string identifiant le type de question pour le chargement dynamique.
   */
  controlType: string;

  /**
   * La clé de cette question, cette clé sera également utilisée pour identifier les réponses.
   */
  key: string;

  /**
   * S'il est obligatoire de donnée une réponse à cette question (par défaut: true).
   */
  required: boolean = true;

  /**
   * Si les messages d'erreurs sont montrés au plus au niveau de la question ou pas.
   */
  showErrors: boolean = true;

  /**
   * L'idéntifiant cypress de cette question. Cet identifiant est utilisé dans le test d'intégration Cypress.
   */
  dataCyIdentifier: string;

  /**
   * Le libellé de la question ou une méthode qui génère le libellé à partir des données déjà saisie dans le formulaire.
   */
  label: I18nString | ((value: any) => I18nString);

  /**
   * Optionnellement, le texte d'aide ou une méthode qui génère le texte à partir des données déjà saisie dans le
   * formulaire.
   */
  help?: I18nString | ((value: any) => I18nString);

  /**
   * Optionel. Un texte d'introduction à afficher avant la question.
   */
  introduction?: I18nString | ((value: any) => I18nString);

  /**
   * Optionnellement, une section de texte d'aide supplementaire depliable ou une méthode qui génère le texte à partir
   * des données déjà saisie dans le formulaire.
   */
  extraHelp?: I18nString | ((value: any) => I18nString);

  /**
   * Les libellés pour les messages d'erreurs qui sont lié à cette question
   */
  errorLabels: { [key: string]: I18nString };

  /**
   * Un callback permettant d'oobserver un changement dans la réponse de la quesiton.
   *
   * @param control le control subjacent.
   */
  onValueChanged?: (control: UntypedFormGroup) => void;

  private readonly _validators: ValidatorFn[] = [];

  /**
   * Crée une nouvelle question.
   *
   * @param options les valeurs d'initialisation de la question.
   */
  protected constructor(options: QuestionSchema) {
    this.key = options.key;
    this.required = options.required !== null && options.required !== undefined ? options.required : true;
    this.showErrors = options.showErrors !== null && options.showErrors !== undefined ? options.showErrors : true;
    this.dataCyIdentifier = options.dataCyIdentifier;
    this.label = options.label;
    this.help = options.help;
    this.introduction = options.introduction;
    this.extraHelp = options.extraHelp;
    this.errorLabels = options.errorLabels || {};
    this.onValueChanged = options.onValueChanged;
    this._validators = options.validators !== null && options.validators !== undefined ? options.validators : [];
  }

  /**
   * Toutes les fonctions de validation de cette question.
   */
  protected get validators() {
    if (this.required) {
      return this._validators.concat(this.requiredValidator());
    } else {
      return this._validators;
    }
  }

  /**
   * Fonction qui valide la présence d'une valeur dans la réponse. Elle peut être altérée par des implémentations de
   * cette classe selon les besoins.
   */
  protected requiredValidator(): ValidatorFn {
    return Validators.required;
  }

  /**
   * Transforme cette question en un AbstractControl qui peut être exploité par un reactive form d'angular.
   *
   * @param defaultValue si elle existe, une valeur qui remplira la nouvelle instance de contrôle du formulaire.
   */
  abstract toFormControl(defaultValue?: T): AbstractControl;

  /**
   * Accepte le visiteur donné et exécute la fonction de visite pour ce type de question.
   *
   * @param visitor le visiteur.
   */
  abstract accept<E>(visitor: QuestionVisitorModel<E>): E;
}

/**
 * Un modèle de question avec une réponse simple en form de string.
 */
export abstract class StringQuestion extends Question<StringAnswer> {
  toFormControl(defaultValue?: StringAnswer): AbstractControl {
    return new UntypedFormControl(defaultValue ? defaultValue.value : null, this.validators);
  }
}

/**
 * Un modèle de question avec une réponse simple en form de string.
 */
export abstract class OptionQuestion<T> extends Question<OptionAnswer<T>> {
  toFormControl(defaultValue?: OptionAnswer<T>): AbstractControl {
    return new UntypedFormControl(defaultValue && defaultValue.value ? defaultValue.value.value : null, this.validators);
  }
}

/**
 * Un modèle représentant un choix pour une question avec multiple options.
 */
export interface QuestionOption<T> {
  /**
   * La valeur de cette option.
   */
  value: T;

  /**
   * Le libellé de la question.
   */
  label: I18nString;

  /**
   * Optionnellement, le texte d'aide.
   */
  help?: I18nString;
}
