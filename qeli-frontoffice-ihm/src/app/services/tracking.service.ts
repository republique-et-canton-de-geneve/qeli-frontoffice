import { Injectable } from '@angular/core';
import { MatomoInjector, MatomoTracker } from 'ngx-matomo';
import { QuestionBase } from '../core/question/question-base.model';
import { environment } from '../../environments/environment';
import { Refus } from '../core/dynamic-form/form-state.model';
import { Prestation } from '../core/common/prestation.model';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {

  readonly FORM = 'Formulaire';
  readonly QUESTION = 'question';
  readonly ANSWER = 'reponse';
  readonly RESULT = 'resultat';

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
   * Trace une question ou résultat
   *
   * @param formCompleted
   * @param lastQuestion
   * @param prestationsRefusees
   */
  trackPageView(formCompleted: boolean, lastQuestion: QuestionBase<any>, prestationsRefusees: Refus[]) {
    if (!formCompleted) {
      this.trackQuestion(lastQuestion);
    } else {
      this.trackResult(prestationsRefusees);
    }
  }

  /**
   * Trace un évènement avec la catégorie Formulaire, une action (Question, Résultat, Réponse...), un nom optionnel et
   * une valeur numérique optionnelle.
   *
   * @param action
   * @param [name]
   * @param [value]
   */
  trackEvent(action: string, name?: string, value?: number) {
    this.matomoTracker.trackEvent(this.FORM, action, name, value);
  }

  /**
   * Trace la question courante via un titre de page et une url personnalisés
   * @param lastQuestion
   */
  trackQuestion(lastQuestion: QuestionBase<any>) {
    const questionCodeKey = lastQuestion.code + '_' + lastQuestion.key;
    const trackingUrl = location.href.split('?')[0] + this.QUESTION + '/' + lastQuestion.code + '_' + lastQuestion.key;
    this.matomoTracker.setCustomUrl(trackingUrl);
    this.matomoTracker.trackPageView(this.QUESTION + '/' + questionCodeKey);
  }

  /**
   * Trace la réponse à une question via un évènement
   * @param questionCodeKey
   * @param answer
   */
  trackAnswer(questionCodeKey: string, answer: string) {
    this.matomoTracker.setCustomVariable(1, questionCodeKey, answer, 'page');
    this.trackEvent(this.ANSWER, questionCodeKey);
    this.matomoTracker.deleteCustomVariable(1, 'page');
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

    const trackingUrl = location.href.split('?')[0] + this.RESULT;
    this.matomoTracker.setCustomUrl(trackingUrl);

    this.matomoTracker.setCustomVariable(1, "prestations-eligibles", reponsesEligible.join(';'), 'page');
    this.matomoTracker.setCustomVariable(2, "prestations-refusees", reponsesRefusees.join(';'), 'page');
    this.matomoTracker.setCustomVariable(3, "prestations-percues", reponsesDejaPercues.join(';'), 'page');

    this.matomoTracker.trackPageView(this.RESULT);

    this.matomoTracker.deleteCustomVariable(1, 'page');
    this.matomoTracker.deleteCustomVariable(2, 'page');
    this.matomoTracker.deleteCustomVariable(3, 'page');
    this.matomoTracker.trackGoal(1, 0);
  }

}
