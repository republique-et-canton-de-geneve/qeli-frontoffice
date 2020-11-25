import { FormData, Question } from '../../dynamic-question/model/question.model';
import { Answer } from '../../dynamic-question/model/answer.model';
import { Eligibilite, EligibiliteRefusee } from './eligibilite.model';

/**
 * Un modèle de fonction de refus d'eligibilité.
 */
export interface RefusEligibiliteFn {
  /**
   * Determine les éligibilités qui vont être refusées d'après les informations saisies dans le formulaire et les
   * éligibilités restantes.
   *
   * @param formData les données saisies dans le formulaire.
   * @param eligibilites les éligibilités encore possibles.
   *
   * @return les nouvelles éligibilités refusées ou une liste vide si aucune éligibilité n'a été refusée.
   */
  (formData: FormData, eligibilites: Eligibilite[]): EligibiliteRefusee[];
}

/**
 * Un modèle de fonction de saut de question.
 */
export interface QuestionSkipFn {
  /**
   * Si la question doit être ignorée pour les données de formulaire saisies et les éligibilités restantes.
   *
   * @param formData les données saisies dans le formulaire.
   * @param eligibilite les éligibilités encore possibles.
   *
   * @return true si la question doit être ignorée.
   */
  (formData: FormData, eligibilite: Eligibilite[]): boolean;
}

/**
 * Un modèle de fonction de réponse par défaut.
 */
export interface DefaultAnswerFn<T> {
  /**
   * Calcule la réponse par défaut à la question, compte tenu des données du formulaire saisies et des éligibilités
   * restantes.
   *
   * @param formData les données saisies dans le formulaire.
   * @param eligibilite les éligibilités encore possibles.
   *
   * @return la réponse par défaut ou null si aucune réponse ne peut pas être déterminée.
   */
  (formData: FormData, eligibilite: Eligibilite[]): T;
}

/**
 * Un enum représentant toutes les catégories des questions pour le questionnaire d'éligibilité.
 */
export enum Categorie {
  ETAT_CIVIL                = 'ETAT_CIVIL',
  PRESTATION                = 'PRESTATION',
  FORMATION                 = 'FORMATION',
  NATIONALITE               = 'NATIONALITE',
  DOMICILE                  = 'DOMICILE',
  REVENUS                   = 'REVENUS',
  SITUATION_PROFESSIONNELLE = 'SITUATION_PROFESSIONNELLE',
  LOGEMENT                  = 'LOGEMENT',
  ASSURANCE_MALADIE         = 'ASSURANCE_MALADIE',
  PENSION_ALIMENTAIRE       = 'PENSION_ALIMENTAIRE',
  MONTANT_FORTUNE           = 'MONTANT_FORTUNE',
  SITUATION_FISCALE         = 'SITUATION_FISCALE'
}

/**
 * Un décorateur de question qui étend ses fonctionnalités en fonction des exigences de flux du questionnaire
 * d'éligibilité.
 */
export interface QeliQuestionDecorator<T extends Answer> {
  /**
   * La question.
   */
  question: Question<T>;

  /**
   * Les éligibilités qui concernent cette question.
   */
  eligibilites: Eligibilite[];

  /**
   * La fonction pour déterminer si cette question doit être ignorée ou pas.
   */
  skip?: QuestionSkipFn;

  /**
   * La fonction pour déterminer si une réponse par défaut peut être fournie.
   */
  defaultAnswer?: DefaultAnswerFn<T>;

  /**
   * La fonction pour déterminer les nouveaux refus d'éligibilité une fois cette question répondu.
   */
  calculateRefus: RefusEligibiliteFn;

  /**
   * La catégorie à la quelle appartient cette question.
   */
  categorie: Categorie;
}
