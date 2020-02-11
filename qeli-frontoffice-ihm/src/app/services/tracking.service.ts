import { Injectable } from '@angular/core';
import { MatomoInjector, MatomoTracker } from 'ngx-matomo';
import { QuestionBase } from '../core/question/question-base.model';
import { environment } from '../../environments/environment';
import { Refus } from '../core/dynamic-form/form-state.model';
import { Prestation } from '../core/common/prestation.model';

export const SCOPE_PAGE = 'page';
export const TRACK_FORM = 'Formulaire';
export const TRACK_QUESTION = 'question';
export const TRACK_ANSWER = 'reponse';
export const TRACK_RESULT = 'resultat';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {


  constructor(private matomoInjector: MatomoInjector,
              private matomoTracker: MatomoTracker) {
  }

  /**
   * Injecte le code de traçage
   */
  initMatomo() {
    this.matomoInjector.init(environment.matomoServer, environment.matomoSiteId);
  }

  /**
   * Trace un évènement avec la catégorie Formulaire, une action (Question, Résultat, Réponse...), un nom optionnel et
   * une valeur numérique optionnelle.
   *
   * @param action
   * @param [name]
   * @param [value]
   */
  private trackEvent(action: string, name?: string, value?: number) {
    this.matomoTracker.trackEvent(TRACK_FORM, action, name, value);
  }

  /**
   * Trace la question courante via un titre de page et une url personnalisés
   * @param question
   */
  trackQuestion(question: QuestionBase<any>) {
    const trackingUrl = location.href.split('?')[0] + TRACK_QUESTION + '/' + question.codeKey;
    this.matomoTracker.setCustomUrl(trackingUrl);
    this.matomoTracker.trackPageView(TRACK_QUESTION + '/' + question.codeKey);
  }

  /**
   * Trace la réponse à une question via un évènement
   * @param question
   * @param answer
   */
  trackAnswer(question: QuestionBase<any>, answer: string) {
    this.matomoTracker.setCustomVariable(1, question.codeKey, answer, SCOPE_PAGE);
    this.trackEvent(TRACK_ANSWER, question.codeKey);
    this.matomoTracker.deleteCustomVariable(1, SCOPE_PAGE);
  }

  /**
   * Trace l'écran de résultat avec les prestations via un titre de page et une url personnalisés
   * @param prestationsRefusees
   */
  trackResult(prestationsRefusees: Refus[]) {
    const reponsesEligible = Object.values(Prestation).filter(
      prestation => !prestationsRefusees.some(
        prestationRefusee => prestationRefusee.prestation === prestation
      )
    );

    const reponsesDejaPercues = prestationsRefusees.filter(
      prestationRefusee => prestationRefusee.questionKey === 'prestations'
    ).map(prestationRefusee => prestationRefusee.prestation);

    const reponsesRefusees = prestationsRefusees.filter(
      prestationRefusee => prestationRefusee.questionKey !== 'prestations'
    ).map(prestationRefusee => prestationRefusee.prestation);

    const trackingUrl = location.href.split('?')[0] + TRACK_RESULT;
    this.matomoTracker.setCustomUrl(trackingUrl);

    this.matomoTracker.setCustomVariable(1, "prestations-eligibles", reponsesEligible.join(';'), SCOPE_PAGE);
    this.matomoTracker.setCustomVariable(2, "prestations-refusees", reponsesRefusees.join(';'), SCOPE_PAGE);
    this.matomoTracker.setCustomVariable(3, "prestations-percues", reponsesDejaPercues.join(';'), SCOPE_PAGE);

    this.matomoTracker.trackPageView(TRACK_RESULT);

    this.matomoTracker.deleteCustomVariable(1, SCOPE_PAGE);
    this.matomoTracker.deleteCustomVariable(2, SCOPE_PAGE);
    this.matomoTracker.deleteCustomVariable(3, SCOPE_PAGE);
    this.matomoTracker.trackGoal(1, 0);
  }

}
