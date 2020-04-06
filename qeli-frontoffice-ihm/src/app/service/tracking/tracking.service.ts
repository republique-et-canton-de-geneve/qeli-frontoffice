import { Injectable } from '@angular/core';
import { MatomoInjector, MatomoTracker } from 'ngx-matomo';
import { environment } from '../../../environments/environment';
import { CheckboxGroupAnswer } from '../../dynamic-question/checkbox-group-question/checkbox-group-question.model';
import { DateAnswer } from '../../dynamic-question/date-question/date-question.model';
import { NationaliteAnswer } from '../../dynamic-question/nationalite-question/nationalite-question.model';
import { FormData, Question } from '../../dynamic-question/model/question.model';
import { AnswerVisitor } from '../../dynamic-question/model/answer-visitor.model';
import { Answer, NumberAnswer, OptionAnswer, StringAnswer } from '../../dynamic-question/model/answer.model';
import { QeliState } from '../question/qeli-state.model';
import { Prestation } from '../configuration/prestation.model';
import { FormatAnswerVisitor } from '../../dynamic-question/model/format-answer.visitor';
import { TranslateService } from '@ngx-translate/core';
import { CompositeAnswer } from '../../dynamic-question/composite-question/composite-question.model';

const SCOPE_PAGE = 'page';
const TRACK_FORM = 'Formulaire';
const TRACK_QUESTION = 'question';
const TRACK_ANSWER = 'reponse';
const TRACK_RESULT = 'resultat';
const TRACK_LINK = 'lien';
const TRACK_INCONNU = 'inconnu';
const DIMENSION_INCONNU = 1;
const DIMENSION_LINK = 2;

@Injectable({
  providedIn: 'root'
})
export class TrackingService {

  constructor(private translateService: TranslateService,
              private matomoInjector: MatomoInjector,
              private matomoTracker: MatomoTracker) {
  }

  /**
   * Injecte le code de traçage
   */
  initMatomo() {
    this.matomoInjector.init(environment.matomoServer, environment.matomoSiteId);
    this.matomoTracker.setSecureCookie(true);
  }

  /**
   * Trace l'usage de la fonction deep link.
   *
   * @param currentQuestion la question affichée en ce moment.
   */
  trackDeepLink(currentQuestion: Question<any>) {
    const trackingPage = currentQuestion ? currentQuestion.dataCyIdentifier : 'resultat';
    this.matomoTracker.setCustomDimension(DIMENSION_LINK, trackingPage);
    this.trackEvent(TRACK_LINK, trackingPage);
    this.matomoTracker.deleteCustomDimension(DIMENSION_LINK);
  }

  /**
   * Trace un évènement avec la catégorie Formulaire, une action (Question, Résultat, Réponse...), un nom optionnel et
   * une valeur numérique optionnelle.
   */
  private trackEvent(action: string, name?: string, value?: number) {
    this.matomoTracker.trackEvent(TRACK_FORM, action, name, value);
  }

  /**
   * Trace l'affichage d'une question via un titre de page et une url personnalisés
   *
   * @param question la question à tracer.
   */
  trackQuestion(question: Question<any>) {
    const trackingUrl = location.href.split('?')[0] + TRACK_QUESTION + '/' + question.dataCyIdentifier;
    this.matomoTracker.setCustomUrl(trackingUrl);
    this.matomoTracker.trackPageView(TRACK_QUESTION + '/' + question.dataCyIdentifier);
    window["_paq"].push(['FormAnalytics::scanForForms']);
  }

  /**
   * Trace individuellement la réponse à une question.
   *
   * @param question la question qui a été posée.
   * @param answer la réponse donée.
   */
  trackAnswer(question: Question<any>, answer: Answer) {
    if (answer.accept(new IsInconnuAnswerVisitor())) {
      this.trackReponseInconnu(question);
    } else {
      const formattedAnswer = answer.accept(new FormatAnswerVisitor(this.translateService));
      this.matomoTracker.setCustomVariable(1, question.dataCyIdentifier, formattedAnswer, SCOPE_PAGE);
      this.trackEvent(TRACK_ANSWER, question.dataCyIdentifier);
      this.matomoTracker.deleteCustomVariable(1, SCOPE_PAGE);
    }
  }

  private trackReponseInconnu(question: Question<any>) {
    this.matomoTracker.setCustomDimension(DIMENSION_INCONNU, question.dataCyIdentifier);
    this.trackEvent(TRACK_INCONNU, question.dataCyIdentifier);
    this.matomoTracker.deleteCustomDimension(DIMENSION_INCONNU);
  }

  /**
   * Trace le résultat du formulaire d'éligibilité ainsi que les réponse donées.
   *
   * @param state l'état du formulaire d'éligibilité.
   * @param questions la liste de questions de ce formulaire d'éligibilité.
   * @param formElement l'élément form affiché sur l'écran lors du questionnaire.
   */
  trackQeliResult(state: QeliState, questions: Question<any>[], formElement: HTMLElement) {
    this.trackAnswers(state.formData, questions);
    this.trackEligibilite(state);
    this.trackFormSubmission(formElement);
  }

  private trackAnswers(formData: FormData, questions: Question<any>[]) {
    const answerVisitor = new FormatAnswerVisitor(this.translateService);
    questions.filter(question => formData.hasOwnProperty(question.key) !== null).forEach(question => {
      this.matomoTracker.trackSiteSearch(formData[question.key].accept(answerVisitor), question.dataCyIdentifier)
    });
  }

  private trackFormSubmission(formElement: HTMLElement) {
    const trackingUrl = location.href.split('?')[0] + TRACK_RESULT;
    this.matomoTracker.setCustomUrl(trackingUrl);
    this.matomoTracker.trackPageView(TRACK_RESULT);

    let args = [];
    if (!!formElement) {
      args.push(formElement);
    }
    window["_paq"].push(['FormAnalytics::trackFormSubmit'].concat(args));
    window["_paq"].push(['FormAnalytics::trackFormConversion'].concat(args));

    this.matomoTracker.trackGoal(1);
  }

  private trackEligibilite(state: QeliState) {
    const dejaPercues = state.eligibilitesRefusees.filter(e => e.dejaPercue).map(e => e.eligibilite.prestation);
    const refusees = state.eligibilitesRefusees.filter(e => !e.dejaPercue);
    const eligibiles = Object.values(Prestation)
                             .filter(p => !dejaPercues.includes(p) &&
                                          !refusees.some(r => r.eligibilite.prestation === p));

    eligibiles.forEach((eligibile) => {
      this.matomoTracker.trackSiteSearch(eligibile, "prestations-eligibles");
    });
    refusees.forEach((refusee) => {
      this.matomoTracker.trackSiteSearch(refusee.eligibilite.prestation, "prestations-refusees");
    });
    dejaPercues.forEach((dejaercue) => {
      this.matomoTracker.trackSiteSearch(dejaercue, "prestations-percues");
    });
  }
}

class IsInconnuAnswerVisitor implements AnswerVisitor<boolean> {
  visitCheckboxGroupAnswer(answer: CheckboxGroupAnswer): boolean {
    return answer.none.value === 'INCONNU';
  }

  visitDateAnswer(answer: DateAnswer): boolean {
    return answer.shortcut && answer.shortcut.value === 'INCONNU';
  }

  visitNationaliteAnswer(answer: NationaliteAnswer): boolean {
    return false;
  }

  visitNumberAnswer(answer: NumberAnswer): boolean {
    return false;
  }

  visitOptionAnswer<E>(answer: OptionAnswer<E>): boolean {
    const value = answer.value ? answer.value.value : null;

    if (value && typeof value === 'string') {
      return value === 'INCONNU';
    }

    return false;
  }

  visitStringAnswer(answer: StringAnswer): boolean {
    return false;
  }

  visitCompositeAnswer(answer: CompositeAnswer): boolean {
    return Object.values(answer.answers).some(answer => answer.accept(this));
  }
}
