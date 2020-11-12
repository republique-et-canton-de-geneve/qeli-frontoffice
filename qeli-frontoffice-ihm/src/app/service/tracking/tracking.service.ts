import { Injectable } from '@angular/core';
import { MatomoInjector, MatomoTracker } from 'ngx-matomo';
import { CheckboxGroupAnswer } from '../../dynamic-question/checkbox-group-question/checkbox-group-question.model';
import { DateAnswer } from '../../dynamic-question/date-question/date-question.model';
import { NationaliteAnswer } from '../../dynamic-question/nationalite-question/nationalite-question.model';
import { Question } from '../../dynamic-question/model/question.model';
import { AnswerVisitor } from '../../dynamic-question/model/answer-visitor.model';
import { Answer, NumberAnswer, OptionAnswer, StringAnswer } from '../../dynamic-question/model/answer.model';
import { QeliState } from '../question/qeli-state.model';
import { TranslateService } from '@ngx-translate/core';
import { CompositeAnswer } from '../../dynamic-question/composite-question/composite-question.model';
import { QeliConfiguration } from '../configuration/qeli-configuration.model';
import { TauxAnswer } from '../../dynamic-question/taux-question/taux-question.model';
import { DropdownAnswer } from '../../dynamic-question/dropdown-question/dropdown-question.model';

const TRACK_FORM = 'Formulaire';
const TRACK_QUESTION = 'question';
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
   * Injecte le code de traçage.
   */
  initMatomo(configuration: QeliConfiguration) {
    this.matomoInjector.init(configuration.matomo.server, configuration.matomo.siteId);
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
   * Trace les réponses de genre : 'Je ne sais pas'.
   *
   * @param question la question qui a été posée.
   * @param answer la réponse donée.
   */
  trackReponseInconnu(question: Question<any>, answer: Answer) {
    if (answer.accept(new IsInconnuAnswerVisitor())) {
      this.matomoTracker.setCustomDimension(DIMENSION_INCONNU, question.dataCyIdentifier);
      this.trackEvent(TRACK_INCONNU, question.dataCyIdentifier);
      this.matomoTracker.deleteCustomDimension(DIMENSION_INCONNU);
    }
  }

  /**
   * Trace le résultat du formulaire d'éligibilité ainsi que les réponse donées.
   *
   * @param state l'état du formulaire d'éligibilité.
   * @param formElement l'élément form affiché sur l'écran lors du questionnaire.
   */
  trackQeliResult(state: QeliState, formElement: HTMLElement) {
    this.trackFormSubmission(formElement);
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
}

class IsInconnuAnswerVisitor implements AnswerVisitor<boolean> {
  visitCheckboxGroupAnswer(answer: CheckboxGroupAnswer): boolean {
    return answer.hasSome.value === 'INCONNU';
  }

  visitDateAnswer(answer: DateAnswer): boolean {
    return answer.shortcut && answer.shortcut.value === 'INCONNU';
  }

  visitDropdownAnswer(answer: DropdownAnswer): boolean {
    return answer.hasSome.value === 'INCONNU';
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

  visitTauxAnswer(answer: TauxAnswer): boolean {
    return false;
  }
}
