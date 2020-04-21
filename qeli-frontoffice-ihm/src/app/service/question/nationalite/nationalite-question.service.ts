import { Injectable } from '@angular/core';
import { QuestionLoader, QuestionUtils } from '../question-loader';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { Categorie, QeliQuestionDecorator, RefusEligibiliteFn, Subcategorie } from '../qeli-question-decorator.model';
import { Eligibilite, EligibiliteGroup, EligibiliteRefusee } from '../eligibilite.model';
import {
  CompositeAnswer, CompositeQuestion
} from '../../../dynamic-question/composite-question/composite-question.model';
import { Prestation } from '../../configuration/prestation.model';
import {
  NationaliteAnswer, NationaliteQuestion
} from '../../../dynamic-question/nationalite-question/nationalite-question.model';
import { RadioQuestion } from '../../../dynamic-question/radio-question/radio-question.model';
import { RequerantRefugie, requerantRefugieAsQuestionOptions } from './requerant-refugie.model';
import { DateAnswer, DateQuestion } from '../../../dynamic-question/date-question/date-question.model';
import * as moment from 'moment';
import { Personne } from '../../configuration/demandeur.model';
import { FormData } from '../../../dynamic-question/model/question.model';
import { OptionAnswer } from '../../../dynamic-question/model/answer.model';
import { Pays, PAYS_AELE_UE, PAYS_CONVENTIONES } from '../../../dynamic-question/nationalite-question/pays.model';
import { REPONSE_PROGRESSIVE_OPTIONS } from '../reponse-binaire.model';
import { AnswerUtils } from '../answer-utils';

@Injectable({
  providedIn: 'root'
})
export class NationaliteQuestionService implements QuestionLoader {

  loadQuestions(configuration: QeliConfiguration, eligibilites: Eligibilite[]): QeliQuestionDecorator<any>[] {
    const eligibiliteGroup = new EligibiliteGroup(eligibilites);
    const membres: Personne[] = ([eligibiliteGroup.demandeur] as Personne[]).concat(
      eligibiliteGroup.demandeur.membresFamille
    );

    const questions: QeliQuestionDecorator<any>[] = membres.map(
      membre => {
        const translateParams = {
          who: membre.id === 0 ? 'me' : 'them',
          membre: membre.prenom
        };

        return {
          question: new CompositeQuestion({
            key: `situationMembre_${membre.id}`,
            dataCyIdentifier: `0406_situationMembre_${membre.id}`,
            label: {key: 'question.situationMembre.label', parameters: translateParams},
            showErrors: false,
            items: [
              {
                question: new NationaliteQuestion({
                  key: `nationalite`,
                  dataCyIdentifier: `0401_nationalite_${membre.id}`,
                  label: {key: 'question.situationMembre.nationalite.label', parameters: translateParams},
                  help: {key: 'question.situationMembre.nationalite.help', parameters: translateParams},
                  errorLabels: {
                    required: {key: 'question.situationMembre.nationalite.error.required', parameters: translateParams}
                  }
                })
              },
              {
                question: new RadioQuestion({
                  key: 'refugie',
                  dataCyIdentifier: `0402_refugie_${membre.id}`,
                  label: {key: 'question.situationMembre.refugie.label', parameters: translateParams},
                  errorLabels: {
                    required: {key: 'question.situationMembre.refugie.error.required', parameters: translateParams}
                  },
                  radioOptions: requerantRefugieAsQuestionOptions(membre)
                }),
                isShown: this.showQuestionsComplementairesSituationMembreFn(membre).bind(this)
              },
              {
                question: new DateQuestion({
                  key: 'dateArriveeSuisse',
                  dataCyIdentifier: `0507_dateArriveeSuisse_${membre.id}`,
                  label: {key: 'question.situationMembre.dateArriveeSuisse.label', parameters: translateParams},
                  minDate: moment().subtract(configuration.minYearsFromNow, 'year').toDate(),
                  maxDate: new Date(),
                  errorLabels: QuestionUtils.toErrorLabels(
                    'dateArriveeSuisse',
                    ['required', 'maxDate', 'minDate', 'invalidDate'],
                    translateParams
                  ),
                  shortcuts: ['NO_SHORTCUT', 'DEPUIS_NAISSANCE', 'INCONNU'].map(shortcut => ({
                    value: shortcut,
                    label: {
                      key: `question.situationMembre.dateArriveeSuisse.shortcut.${shortcut}`,
                      parameters: translateParams
                    }
                  }))
                }),
                isShown: this.showQuestionsComplementairesSituationMembreFn(membre).bind(this)
              }
            ]
          }),
          eligibilites: eligibiliteGroup.findByPrestationEtMembre([Prestation.PC_AVS_AI, Prestation.BOURSES], membre),
          calculateRefus: this.calculateSituationMembreRefusFn(membre),
          categorie: Categorie.SITUATION_PERSONELLE,
          subcategorie: Subcategorie.NATIONALITE
        };
      }
    );

    questions.push({
      question: new CompositeQuestion({
        key: `permisBEtudes`,
        dataCyIdentifier: `0405_permisBEtudes`,
        label: {
          key: 'question.permisBEtudes.label',
          parameters: {numberOfMemebres: eligibiliteGroup.demandeur.membresFamille.length}
        },
        help: {key: 'question.permisBEtudes.help'},
        showErrors: false,
        items: membres.map(membre => {
          const translateParams = {
            who: membre.id === 0 ? 'me' : 'them',
            membre: membre.prenom
          };

          return {
            question: new RadioQuestion({
              key: `permisBEtudes_${membre.id}`,
              dataCyIdentifier: `0405_permisBEtudes_${membre.id}`,
              label: {key: 'question.permisBEtudes.membre', parameters: translateParams},
              errorLabels: {required: {key: 'question.permisBEtudes.error.required', parameters: translateParams}},
              radioOptions: REPONSE_PROGRESSIVE_OPTIONS,
              inline: true
            }),
            isShown: (value: any) => {
              const situation = value[`situationMembre_${membre.id}`];
              const refugie = situation ? situation['refugie'] : null;
              const nationalite = situation ? situation['nationalite'] : null;
              const isApatride = nationalite ? !!nationalite['apatride'] : false;
              const isSuisse = (nationalite ? (nationalite.pays || []) : []).includes(Pays.CH);

              return !isSuisse && !isApatride && refugie !== RequerantRefugie.REFUGIE;
            }
          };
        })
      }),
      eligibilites: eligibiliteGroup.findByPrestation(Prestation.BOURSES),
      skip: formData => {
        return membres.every(membre => {
          return AnswerUtils.isApatride(formData, membre) ||
                 AnswerUtils.isNationalite(formData, membre, Pays.CH) ||
                 AnswerUtils.isRefugie(formData, membre);
        });
      },
      calculateRefus: () => [],
      categorie: Categorie.SITUATION_PERSONELLE,
      subcategorie: Subcategorie.NATIONALITE
    });

    return questions;
  }

  private showQuestionsComplementairesSituationMembreFn(membre: Personne) {
    return (value: any) => {
      const situation = value[`situationMembre_${membre.id}`];
      const nationalite = situation ? situation['nationalite'] : null;
      const isApatride = nationalite ? !!nationalite['apatride'] : false;
      return !isApatride && !this.isSuisseOrUEOrAELE(nationalite ? (nationalite.pays || []) : []);
    };
  }

  private isSuisseOrUEOrAELE(pays: Pays[]) {
    return pays.some(value => value === Pays.CH || PAYS_AELE_UE.includes(value));
  }

  private isAnswerSuisseOrUEorAELE(answer: NationaliteAnswer) {
    return this.isSuisseOrUEOrAELE(answer.pays.map(option => option.value));
  }

  private isAnswerPaysConventionne(answer: NationaliteAnswer) {
    return answer.pays.map(option => option.value).some(value => PAYS_CONVENTIONES.includes(value));
  }

  private habiteEnSuisseDepuis(dateArriveeSuisse: Date, years: number) {
    return moment().subtract(years, 'year')
                   .endOf('day')
                   .isAfter(moment(dateArriveeSuisse));
  }

  private isDateInconnu(dateAnswer: DateAnswer) {
    return dateAnswer.shortcut && dateAnswer.shortcut.value === 'INCONNU';
  }

  private toDate(dateAnswer: DateAnswer, membre: Personne) {
    if (dateAnswer.shortcut && dateAnswer.shortcut.value === 'DEPUIS_NAISSANCE') {
      return membre.dateNaissance;
    } else {
      return dateAnswer.value;
    }
  }

  private calculateSituationMembreRefusFn(membre: Personne): RefusEligibiliteFn {
    return (formData: FormData, eligibilites: Eligibilite[]) => {
      const answers = (formData[`situationMembre_${membre.id}`] as CompositeAnswer).answers;
      const nationaliteAnswer = answers['nationalite'] as NationaliteAnswer;

      // Si la personne à une nationalité Suisse, d'un Pays de l'UE/AELE ou est apatride pas de sortie d'éligibilité
      if (nationaliteAnswer.apatride || this.isAnswerSuisseOrUEorAELE(nationaliteAnswer)) {
        return [];
      }

      const dateArriveeSuisseAnswer = answers['dateArriveeSuisse'] as DateAnswer;
      const isDateArriveeInconnu = this.isDateInconnu(dateArriveeSuisseAnswer);
      const dateArriveEnSuisse: Date = this.toDate(dateArriveeSuisseAnswer, membre);

      // Si la personne habite en Suisse depuis plus de 10 ans (ou elle ne sait pas la date d'arrivée) pas de sortie
      // d'éligibilité.
      if (isDateArriveeInconnu || this.habiteEnSuisseDepuis(dateArriveEnSuisse, 10)) {
        return [];
      }

      const refus: EligibiliteRefusee[] = [];
      const refugieAnswer = (answers['refugie'] as OptionAnswer<RequerantRefugie>);
      const isReugie = refugieAnswer.value.value === RequerantRefugie.REFUGIE;
      const eligibiliteToMotifFn = eligibilite => ({
        key: `question.situationMembre.dateArriveeSuisse.motifRefus.${eligibilite.prestation}`,
        parameters: {who: membre.id === 0 ? 'me' : 'them', membre: membre.prenom}
      });

      if (this.habiteEnSuisseDepuis(dateArriveEnSuisse, 5)) {
        const isRefugieOrInconnu = isReugie || refugieAnswer.value.value === RequerantRefugie.INCONNU;

        // Si la personne habite en Suisse depuis plus de 5 (mais moins de 10) et qu'elle n'est pas réfugiée/inconnu ou
        // avec une nationalité d'un pays conventionné, elle a un refus PC AVS AI.
        if (!isRefugieOrInconnu && !this.isAnswerPaysConventionne(nationaliteAnswer)) {
          QuestionUtils.createRefusByPrestationAndMembre(
            eligibilites, Prestation.PC_AVS_AI, membre, eligibiliteToMotifFn
          ).forEach(eligibiliteRefusee => refus.push(eligibiliteRefusee));
        }
      } else {
        // Refus PC AVS AI si la personne habite en Suisse depuis moins de 5 ans.
        QuestionUtils.createRefusByPrestationAndMembre(
          eligibilites, Prestation.PC_AVS_AI, membre, eligibiliteToMotifFn
        ).forEach(eligibiliteRefusee => refus.push(eligibiliteRefusee));

        // Refus BOURSE si la personne habite en Suisse depuis moins de 5 ans et elle n'est pas réfugiée.
        if (!isReugie) {
          QuestionUtils.createRefusByPrestationAndMembre(
            eligibilites, Prestation.BOURSES, membre, eligibiliteToMotifFn
          ).forEach(eligibiliteRefusee => refus.push(eligibiliteRefusee));
        }
      }

      return refus;
    };
  }
}
