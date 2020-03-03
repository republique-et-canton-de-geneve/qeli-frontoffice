import { Injectable } from '@angular/core';
import { MatomoInjector, MatomoTracker } from 'ngx-matomo';
import { QuestionBase } from '../core/question/question-base.model';
import { environment } from '../../environments/environment';
import { Refus } from '../core/common/form-state.model';
import { PrestationResolver } from '../core/common/prestation-resolver';
import { QuestionVisitor } from '../core/question/question-visitor';
import { CheckboxGroupQuestion } from '../core/question/checkbox-group-question/checkbox-group-question.model';
import { DateQuestion } from '../core/question/date-question/date-question.model';
import { DropdownQuestion } from '../core/question/dropdown-question/dropdown-question.model';
import { NationaliteQuestion } from '../core/question/nationalite-question/nationalite-question.model';
import { RadioQuestion } from '../core/question/radio-question/radio-question.model';
import { TextQuestion } from '../core/question/text-question/text-question.model';
import { ReponseProgressive } from '../core/common/reponse.model';
import { NumberGroupQuestion } from '../core/question/number-group-question/number-group-question.model';

const SCOPE_PAGE = 'page';
const TRACK_FORM = 'Formulaire';
const TRACK_QUESTION = 'question';
const TRACK_ANSWER = 'reponse';
const TRACK_RESULT = 'resultat';

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
   *
   * @param question
   */
  trackQuestion(question: QuestionBase<any>) {
    const trackingUrl = location.href.split('?')[0] + TRACK_QUESTION + '/' + question.identifier;
    this.matomoTracker.setCustomUrl(trackingUrl);
    this.matomoTracker.trackPageView(TRACK_QUESTION + '/' + question.identifier);
  }

  /**
   * Trace la réponse à une question via un évènement
   *
   * @param question
   * @param data
   */
  trackAnswer(question: QuestionBase<any>, data: any) {
    const answer = question.accept(new ToTrackingAnswerQuestionVisitor(data));

    this.matomoTracker.setCustomVariable(1, question.identifier, answer, SCOPE_PAGE);
    this.trackEvent(TRACK_ANSWER, question.identifier);
    this.matomoTracker.deleteCustomVariable(1, SCOPE_PAGE);
  }

  /**
   * Trace l'écran de résultat avec les prestations via un titre de page et une url personnalisés.
   *
   * @param prestationsRefusees les prestation refusées.
   * @param data {} les réponses données dans le formulaire.
   */
  trackResult(prestationsRefusees: Refus[], data: any) {
    const prestationEligibles = PrestationResolver.findPrestationsEligibles(prestationsRefusees);
    const prestationRefusees = PrestationResolver.findPrestationsRefusees(prestationsRefusees, data)
                                                 .map(prestationRefusee => prestationRefusee.prestation);
    const prestationDejaPercues = PrestationResolver.findPrestationsDejaPercues(data);

    const trackingUrl = location.href.split('?')[0] + TRACK_RESULT;
    this.matomoTracker.setCustomUrl(trackingUrl);

    this.matomoTracker.setCustomVariable(1, "prestations-eligibles", prestationEligibles.join(';'), SCOPE_PAGE);
    this.matomoTracker.setCustomVariable(2, "prestations-refusees", prestationRefusees.join(';'), SCOPE_PAGE);
    this.matomoTracker.setCustomVariable(3, "prestations-percues", prestationDejaPercues.join(';'), SCOPE_PAGE);

    this.matomoTracker.trackPageView(TRACK_RESULT);

    this.matomoTracker.deleteCustomVariable(1, SCOPE_PAGE);
    this.matomoTracker.deleteCustomVariable(2, SCOPE_PAGE);
    this.matomoTracker.deleteCustomVariable(3, SCOPE_PAGE);
    this.matomoTracker.trackGoal(1, 0);
  }
}

class ToTrackingAnswerQuestionVisitor implements QuestionVisitor<string> {

  constructor(private data: any) {

  }

  private findValueForQuestion(question: QuestionBase<any>): any {
    return this.data[question.key];
  }

  visitCheckboxGroupQuestion(question: CheckboxGroupQuestion): string {
    const answer = this.findValueForQuestion(question);

    if (answer['none'] !== ReponseProgressive.NON) {
      return answer['none'] === ReponseProgressive.OUI ? 'AUCUNE' : 'INCONNU';
    }

    return answer['choices'].join(';');
  }

  visitDateQuestion(question: DateQuestion): string {
    const answer = this.findValueForQuestion(question);

    if (answer['shortcut'] && answer['shortcut'] !== 'NO_SHORTCUT') {
      return answer['shortcut'];
    }

    return answer['value'];
  }

  visitDropdownQuestion(question: DropdownQuestion): string {
    return this.findValueForQuestion(question);
  }

  visitNationaliteQuestion(question: NationaliteQuestion): string {
    const value = this.findValueForQuestion(question);

    if (!!value['apatride']) {
      return 'APATRIDE';
    }

    return value['pays'] ? value['pays'].join(';') : null;

  }

  visitRadioQuestion(question: RadioQuestion): string {
    return this.findValueForQuestion(question);
  }

  visitTextQuestion(question: TextQuestion): string {
    return this.findValueForQuestion(question);
  }

  visitNumberGroupQuestion(question: NumberGroupQuestion): string {
    const answer = this.findValueForQuestion(question);

    if (!!answer['none']) {
      return 'AUCUN';
    }

    return Object.entries(answer['values']).map(entry => {
      return `${entry[0]}=${entry[1]}`
    }).join('; ');
  }

}
