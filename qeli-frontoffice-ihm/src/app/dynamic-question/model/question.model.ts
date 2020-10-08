import { AbstractControl, FormControl, ValidatorFn, Validators } from '@angular/forms';
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
  preface?: I18nString | ((value: any) => I18nString);
  errorLabels?: { [key: string]: I18nString };
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
   * Optionnellement, une texte qui précède la question une méthode qui génère le texte à partir des données déjà
   * saisie dans le formulaire.
   */
  preface?: I18nString | ((value: any) => I18nString);

  /**
   * Les libellés pour les messages d'erreurs qui sont lié à cette question
   */
  errorLabels: { [key: string]: I18nString };

  private _validators: ValidatorFn[] = [];

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
    this.errorLabels = options.errorLabels || {};
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
    return new FormControl(defaultValue ? defaultValue.value : null, this.validators);
  }
}

/**
 * Un modèle de question avec une réponse simple en form de string.
 */
export abstract class OptionQuestion<T> extends Question<OptionAnswer<T>> {
  toFormControl(defaultValue?: OptionAnswer<T>): AbstractControl {
    return new FormControl(defaultValue && defaultValue.value ? defaultValue.value.value : null, this.validators);
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
