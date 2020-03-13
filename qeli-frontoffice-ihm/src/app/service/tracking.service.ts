import { Injectable } from '@angular/core';
import { MatomoInjector, MatomoTracker } from 'ngx-matomo';
import { QuestionBase } from '../core/question/question-base.model';
import { environment } from '../../environments/environment';
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
import { NumberQuestion } from '../core/question/number-question/number-question.model';
import { TauxQuestion } from '../core/question/taux-question/taux-question.model';

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

  currentPage: string;

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
   * Définit le nom de la page courante, soit l'identifiant de la question soit la page de résultat.
   * @param currentPage
   */
  setCurrentPage(currentPage: string) {
    this.currentPage = currentPage;
  }

  /**
   * Trace la fonction deep link via une dimension personnalisée
   */
  trackDeepLink() {
    this.matomoTracker.setCustomDimension(DIMENSION_LINK, this.currentPage);
    this.trackEvent(TRACK_LINK, this.currentPage);
    this.matomoTracker.deleteCustomDimension(DIMENSION_LINK);
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
   * @param questionIdentifier
   */
  trackQuestion(questionIdentifier: string) {
    this.setCurrentPage(questionIdentifier);
    const trackingUrl = location.href.split('?')[0] + TRACK_QUESTION + '/' + questionIdentifier;
    this.matomoTracker.setCustomUrl(trackingUrl);
    this.matomoTracker.trackPageView(TRACK_QUESTION + '/' + questionIdentifier);

    window["_paq"].push(['FormAnalytics::scanForForms']);
  }

  /**
   * Trace la réponse à une question via une action et une variable personnalisée
   *
   * @param question
   * @param data
   */
  trackReponse(question: QuestionBase<any>, data: any) {
    const answer = question.accept(new ToTrackingAnswerQuestionVisitor(data));
    this.trackReponseInconnu(question, data);

    this.matomoTracker.setCustomVariable(1, question.identifier, answer.join(';'), SCOPE_PAGE);
    this.trackEvent(TRACK_ANSWER, question.identifier);
    this.matomoTracker.deleteCustomVariable(1, SCOPE_PAGE);
  }


  /**
   * Trace une réponse de type inconnu (ne sais pas) via une action et une dimension personnalisée
   *
   * @param question
   * @param data
   */
  trackReponseInconnu(question: QuestionBase<any>, data: any) {
    const isInconnu = question.accept(new IsInconnuAnswerQuestionVisitor(data));
    if (isInconnu) {
      this.matomoTracker.setCustomDimension(DIMENSION_INCONNU, question.identifier);
      this.trackEvent(TRACK_INCONNU, question.identifier);
      this.matomoTracker.deleteCustomDimension(DIMENSION_INCONNU);
    }
  }

  /**
   * Trace l'ensemble des réponses aux questions (sur la page de résultat) via la recherche.
   *
   * @param questions
   * @param data
   */
  trackReponsesFinales(questions: any, data: any) {
    this.setCurrentPage("resultat");
    questions.forEach(question => {
      const answer = question.accept(new ToTrackingAnswerQuestionVisitor(data));
      if (answer) {
        console.log(answer);
        answer.forEach((singleAnswer) => this.matomoTracker.trackSiteSearch(singleAnswer, question.identifier));
      }
    });
  }

  /**
   * Trace la page de résultat via un titre de page et une url personnalisés.
   *
   * @param formState
   * @param formElement
   */
  trackFormSubmission(formState: any, formElement: HTMLElement) {
    this.trackResultatsEligibilite(formState);
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

  /**
   * Trace les résultats d'éligibilité aux prestations.
   *
   * @param formState
   */
  trackResultatsEligibilite(formState: any) {
    const prestationsEligible = PrestationResolver.findPrestationsEligibles(formState.prestationsRefusees);
    const prestationsRefusees = PrestationResolver.findPrestationsRefusees(formState.prestationsRefusees,
      formState.data);
    const prestationsDejaPercues = PrestationResolver.findPrestationsDejaPercues(formState.data);

    prestationsEligible.forEach((prestationEligible) => {
      this.matomoTracker.trackSiteSearch(prestationEligible, "prestations-eligibles");
    });
    prestationsRefusees.forEach((prestationRefusee) => {
      this.matomoTracker.trackSiteSearch(prestationRefusee.prestation, "prestations-refusees");
    });
    prestationsDejaPercues.forEach((prestationDejaPercue) => {
      this.matomoTracker.trackSiteSearch(prestationDejaPercue, "prestations-percues");
    });
  }
}

class ToTrackingAnswerQuestionVisitor implements QuestionVisitor<string[]> {

  constructor(private data: any) {

  }

  private findValueForQuestion(question: QuestionBase<any>): any {
    return this.data[question.key];
  }

  visitCheckboxGroupQuestion(question: CheckboxGroupQuestion): string[] {
    const answer = this.findValueForQuestion(question);
    let result = [];

    if (answer['none'] !== ReponseProgressive.NON) {
      result.push(answer['none'] === ReponseProgressive.OUI ? 'AUCUNE' : 'INCONNU');
    }
    answer['choices'].forEach(value => {
      result.push(value);
    });

    return result;
  }

  visitDateQuestion(question: DateQuestion): string[] {
    const answer = this.findValueForQuestion(question);

    if (answer['shortcut'] && answer['shortcut'] !== 'NO_SHORTCUT') {
      return [answer['shortcut']];
    }

    return answer['value'] ? [answer['value']] : [];
  }

  visitDropdownQuestion(question: DropdownQuestion): string[] {
    const answer = this.findValueForQuestion(question);
    return answer ? [answer] : [];
  }

  visitNationaliteQuestion(question: NationaliteQuestion): string[] {
    const value = this.findValueForQuestion(question);

    if (!!value['apatride']) {
      return ['APATRIDE'];
    }
    return value['pays'].filter(x => x != null);
  }

  visitNumberQuestion(question: NumberQuestion): string[] {
    const answer = this.findValueForQuestion(question);
    return answer ? [answer] : [];
  }

  visitRadioQuestion(question: RadioQuestion): string[] {
    const answer = this.findValueForQuestion(question);
    return answer ? [answer] : [];
  }

  visitTauxQuestion(question: TauxQuestion): string[] {
    const value = this.findValueForQuestion(question);
    return [value['taux']];
  }

  visitTextQuestion(question: TextQuestion): string[] {
    const answer = this.findValueForQuestion(question);
    return answer ? [answer] : [];
  }

  visitNumberGroupQuestion(question: NumberGroupQuestion): string[] {
    const answer = this.findValueForQuestion(question);

    if (!!answer['none']) {
      return ['AUCUN'];
    }

    return Object.entries(answer['values']).map(entry => {
      return `${entry[0]}=${entry[1]}`
    });
  }

}

class IsInconnuAnswerQuestionVisitor implements QuestionVisitor<boolean> {

  constructor(private data: any) {

  }

  private findValueForQuestion(question: QuestionBase<any>): any {
    return this.data[question.key];
  }

  visitCheckboxGroupQuestion(question: CheckboxGroupQuestion): boolean {
    const answer = this.findValueForQuestion(question);
    return answer['none'] === ReponseProgressive.INCONNU;
  }

  visitDateQuestion(question: DateQuestion): boolean {
    const answer = this.findValueForQuestion(question);
    return (answer['shortcut'] && answer['shortcut'] === 'INCONNU');
  }

  visitDropdownQuestion(question: DropdownQuestion): boolean {
    return false;
  }

  visitNationaliteQuestion(question: NationaliteQuestion): boolean {
    return false;
  }

  visitNumberGroupQuestion(question: NumberGroupQuestion): boolean {
    return false;
  }

  visitNumberQuestion(question: NumberQuestion): boolean {
    return false;
  }

  visitRadioQuestion(question: RadioQuestion): boolean {
    const answer = this.findValueForQuestion(question);
    return answer === ReponseProgressive.INCONNU;
  }

  visitTauxQuestion(question: TauxQuestion): boolean {
    return false;
  }

  visitTextQuestion(question: TextQuestion): boolean {
    return false;
  }

}
