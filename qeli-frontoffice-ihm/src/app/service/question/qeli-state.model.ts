import { QeliQuestionDecorator } from './qeli-question-decorator.model';
import { Answer } from '../../dynamic-question/model/answer.model';
import { FormData, Question } from '../../dynamic-question/model/quesiton.model';
import { Eligibilite, EligibiliteGroup, EligibiliteRefusee } from './eligibilite.model';
import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Demandeur, DemandeurSchema } from '../configuration/demandeur.model';

/**
 * Une stratégie qui permet de trouver le prochain élément non désactivable dans une liste de questions à partir d'un
 * point de départ.
 */
export class NextQuestionFinder {
  private questions: QeliQuestionDecorator<any>[];

  constructor(questions: QeliQuestionDecorator<any>[]) {
    this.questions = questions;
  }

  /**
   * À partir d'un point de départ, trouve l'index de la suivante question à poser selon les données saisies dans le
   * formulaire et la matrice d'éligibilité actuelle.
   *
   * @param formData les données saisies dans le formulaire.
   * @param eligibilites les éligibilités encore possibles.
   * @param startIndex le point de départ.
   */
  findNextQuestionIndex(formData: FormData, eligibilites: Eligibilite[], startIndex: number = 0): number {
    const eligibiliteAsGroup = new EligibiliteGroup(eligibilites);

    return this.questions.findIndex((question, index) => {
      if (index < startIndex) {
        return false;
      }

      if (!question.eligibilites.some(el => eligibiliteAsGroup.includes(el))) {
        return false;
      }

      console.log(question.skip(formData, eligibilites));
      return question.skip === null ||
             question.skip === undefined ||
             !question.skip(formData, eligibilites);
    });
  }
}

export interface QeliStateSchema {
  formData?: FormData;
  demandeur: DemandeurSchema;
  currentQuestionIndex?: number;
  questionIndexHistory?: number[];
  eligibilitesRefusees?: EligibiliteRefusee[];
  eligibilitesRefuseesHistory?: EligibiliteRefusee[][];
  done?: boolean;
}

/**
 * Un modèle qui représente l'état du questionnaire d'éligibilité à un moment donné.
 */
export class QeliState {
  /**
   * Les données saisies dans le formulaire.
   */
  formData: FormData;

  /**
   * Le demandeur.
   */
  demandeur: Demandeur;

  /**
   * Le tableau d'éligibilité au départ du questionnaire.
   */
  eligibilites: Eligibilite[];

  /**
   * L'index de la questionne actuel.
   */
  currentQuestionIndex: number;

  /**
   * L'historique des index.
   */
  questionIndexHistory: number[];

  /**
   * Les éligibilités déjà refusées.
   */
  eligibilitesRefusees: EligibiliteRefusee[];

  /**
   * L'historique d'éligibilités refusées.
   */
  eligibilitesRefuseesHistory: EligibiliteRefusee[][];

  /**
   * Si le questionnaire est terminé ou non.
   */
  done: boolean;

  constructor(options: QeliStateSchema) {
    this.formData = options.formData || {};
    this.demandeur = new Demandeur(options.demandeur);
    this.eligibilites = this.demandeur.toEligibilite();
    this.currentQuestionIndex = options.currentQuestionIndex || 0;
    this.questionIndexHistory = options.questionIndexHistory || [];
    this.eligibilitesRefusees = options.eligibilitesRefusees || [];
    this.eligibilitesRefuseesHistory = options.eligibilitesRefuseesHistory || [];
    this.done = !!options.done;
  }
}

/**
 * Une machine à états pour la transition entre les questions. Cette machine utilise des piles pour préserver
 * l'historique des états précédents.
 */
export class QeliStateMachine {
  private _nextQuestionFinder: NextQuestionFinder;
  private _onQuestionChangeEvents: EventEmitter<QeliQuestionDecorator<any>> = new EventEmitter();

  questions: QeliQuestionDecorator<any>[];

  /**
   * L'état de la machine.
   */
  state: QeliState;

  /**
   * Crée une nouvelle machine d'état pour le questionnaire.
   *
   * @param questions les questions du formulaire.
   * @param state l'état initial.
   */
  constructor(questions: QeliQuestionDecorator<any>[], state: QeliState) {
    this.questions = questions;
    this.state = state;
    this._nextQuestionFinder = new NextQuestionFinder(this.questions);
  }

  /**
   * Répond à la question actuelle et passe à la question suivante en mettant à jour l'historique en conséquence. La
   * question suivante est retrouvés selon les données saisies dans le formulaire et la matrice d'éligibilité mises à
   * jour.
   *
   * @param answer la réponse à la question actuelle.
   */
  answerAndGetNextQuestion(answer: Answer): QeliQuestionDecorator<any> {
    this.state.questionIndexHistory.push(this.state.currentQuestionIndex);
    this.state.eligibilitesRefuseesHistory.push(this.state.eligibilitesRefusees);

    const currentQuestion = this._answerAndGetNextQuestion(answer);
    this._onQuestionChangeEvents.emit(currentQuestion);
    return currentQuestion;
  }

  private _answerAndGetNextQuestion(answer: Answer) {
    const previousQuestion = this.currentQuestion;

    this.state.formData[previousQuestion.question.key] = answer;
    this.state.eligibilitesRefusees = this.state.eligibilitesRefusees.concat(
      previousQuestion.calculateRefus(this.state.formData, this.currentEligibilites)
    );
    this.state.currentQuestionIndex = this._nextQuestionFinder.findNextQuestionIndex(
      this.state.formData, this.currentEligibilites, this.state.currentQuestionIndex + 1
    );
    this.state.done = this.state.currentQuestionIndex === -1;

    if (!this.state.done) {
      const currentQuestion = this.currentQuestion;
      const defaultAnswer = currentQuestion.defaultAnswer ?
                            currentQuestion.defaultAnswer(this.state.formData, this.currentEligibilites) :
                            null;

      if (defaultAnswer !== null &&
          defaultAnswer !== undefined) {
        return this._answerAndGetNextQuestion(defaultAnswer);
      } else {
        return currentQuestion;
      }
    } else {
      return null;
    }
  }

  /**
   * Accède à la question précédente et met à jour l'historique en conséquence.
   *
   * @return la question précédente.
   */
  previousQuestion(): QeliQuestionDecorator<any> {
    this.state.currentQuestionIndex = this.state.questionIndexHistory.pop();
    this.state.eligibilitesRefusees = this.state.eligibilitesRefuseesHistory.pop();
    this.state.done = false;

    const currentQuestion = this.currentQuestion;
    this._onQuestionChangeEvents.emit(currentQuestion);

    return currentQuestion;
  }

  /**
   * Si la question a été posée, essayez de la charger à partir de l'historique de l'index et de mettre à jour l'état
   * en conséquence.
   *
   * @param targetQuestion la question recherchée.
   */
  navigateToQuestion(targetQuestion: Question<any>): QeliQuestionDecorator<any> {
    const targetQuestionIndex = this.questions.findIndex(decorator => targetQuestion.key === decorator.question.key);
    const stackIndex = this.state.questionIndexHistory.findIndex(index => index === targetQuestionIndex);

    return this.navigateToQuestionByHistoryIndex(stackIndex);
  }

  /**
   * Accède à une question par son index dans la pile d'historique et met à jour l'historique en conséquence.
   *
   * @param historyIndex l'index de la question dans le pile d'historique.
   */
  navigateToQuestionByHistoryIndex(historyIndex: number): QeliQuestionDecorator<any> {
    this.state.questionIndexHistory = this.state.questionIndexHistory.slice(0, historyIndex + 1);
    this.state.eligibilitesRefuseesHistory = this.state.eligibilitesRefuseesHistory.slice(0, historyIndex + 1);

    return this.previousQuestion();
  }

  /**
   * La matrice d'élgibilités possibles dans l'état actuel.
   */
  get currentEligibilites() {
    const eligibilitesRefuseesAsGroup = new EligibiliteGroup(this.state.eligibilitesRefusees.map(r => r.eligibilite));
    return this.state.eligibilites.filter(el => !eligibilitesRefuseesAsGroup.includes(el));
  }

  /**
   * Quelle question est posée en ce moment.
   */
  get currentQuestion() {
    return this.state.done ? null : this.questions[this.state.currentQuestionIndex];
  }

  get onQuestionChangedEvent(): Observable<QeliQuestionDecorator<any>> {
    return this._onQuestionChangeEvents;
  }
}
