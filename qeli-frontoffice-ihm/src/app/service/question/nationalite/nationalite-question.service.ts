import { Injectable } from '@angular/core';
import { QuestionLoader } from '../question-loader';
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
import { RequerantRefugie } from './requerant-refugie.model';
import { DateAnswer, DateQuestion } from '../../../dynamic-question/date-question/date-question.model';
import * as moment from 'moment';
import { Demandeur, MembreFamille } from '../../configuration/demandeur.model';
import { FormData } from '../../../dynamic-question/model/question.model';
import { OptionAnswer } from '../../../dynamic-question/model/answer.model';
import { Pays, PAYS_AELE_UE, PAYS_CONVENTIONES } from '../../../dynamic-question/nationalite-question/pays.model';

@Injectable({
  providedIn: 'root'
})
export class NationaliteQuestionService implements QuestionLoader {

  loadQuestions(configuration: QeliConfiguration, eligibilites: Eligibilite[]): QeliQuestionDecorator<any>[] {
    const eligibiliteGroup = new EligibiliteGroup(eligibilites);
    const membres: (Demandeur | MembreFamille)[] = [eligibiliteGroup.demandeur];

    return membres.concat(eligibiliteGroup.demandeur.membresFamille).map(membre => {
      const translateParams = {who: membre.id === 0 ? 'me' : 'them', membre: membre.prenom};
      return {
        question: new CompositeQuestion({
          key: `situationMembre_${membre.id}`,
          dataCyIdentifier: `0406_situationMembre_${membre.id}`,
          label: {key: 'question.situationMembre.label', parameters: translateParams},
          showErrors: false,
          items: [
            {
              question: new NationaliteQuestion({
                key: `nationalite_${membre.id}`,
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
                key: `refugie_${membre.id}`,
                dataCyIdentifier: `0402_refugie_${membre.id}`,
                label: {key: 'question.situationMembre.refugie.label', parameters: translateParams},
                errorLabels: {
                  required: {key: 'question.situationMembre.refugie.error.required', parameters: translateParams}
                },
                radioOptions: [
                  {
                    value: RequerantRefugie.REQUERANT_ASILE,
                    label: {
                      key: `common.requerantRefugie.${RequerantRefugie.REQUERANT_ASILE}.label`,
                      parameters: translateParams
                    },
                    help: {
                      key: `common.requerantRefugie.${RequerantRefugie.REQUERANT_ASILE}.help`,
                      parameters: translateParams
                    }
                  },
                  {
                    value: RequerantRefugie.REFUGIE,
                    label: {
                      key: `common.requerantRefugie.${RequerantRefugie.REFUGIE}.label`,
                      parameters: translateParams
                    },
                    help: {
                      key: `common.requerantRefugie.${RequerantRefugie.REFUGIE}.help`,
                      parameters: translateParams
                    }
                  },
                  {
                    value: RequerantRefugie.AUCUN,
                    label: {
                      key: `common.requerantRefugie.${RequerantRefugie.AUCUN}`,
                      parameters: translateParams
                    }
                  },
                  {
                    value: RequerantRefugie.INCONNU,
                    label: {
                      key: `common.requerantRefugie.${RequerantRefugie.INCONNU}`,
                      parameters: translateParams
                    }
                  }
                ]
              }),
              isShown: this.showQuestionsComplementairesFn(membre).bind(this)
            },
            {
              question: new DateQuestion({
                key: `dateArriveeSuisse_${membre.id}`,
                dataCyIdentifier: `0507_dateArriveeSuisse_${membre.id}`,
                label: {key: 'question.situationMembre.dateArriveeSuisse.label', parameters: translateParams},
                minDate: moment().subtract(configuration.minYearsFromNow, 'year').toDate(),
                maxDate: new Date(),
                errorLabels: {
                  required: {
                    key: 'question.situationMembre.dateArriveeSuisse.error.required',
                    parameters: translateParams
                  },
                  maxDate: {
                    key: 'question.situationMembre.dateArriveeSuisse.error.maxDate',
                    parameters: translateParams
                  },
                  minDate: {
                    key: 'question.situationMembre.dateArriveeSuisse.error.minDate',
                    parameters: translateParams
                  },
                  invalidDate: {
                    key: 'question.situationMembre.dateArriveeSuisse.error.invalidDate',
                    parameters: translateParams
                  }
                },
                shortcuts: ['NO_SHORTCUT', 'DEPUIS_NAISSANCE', 'INCONNU'].map(shortcut => ({
                  value: shortcut,
                  label: {
                    key: `question.situationMembre.dateArriveeSuisse.shortcut.${shortcut}`,
                    parameters: translateParams
                  }
                }))
              }),
              isShown: this.showQuestionsComplementairesFn(membre).bind(this)
            }
          ]
        }),
        eligibilites: eligibiliteGroup.findByPrestationEtMembre([Prestation.PC_AVS_AI, Prestation.BOURSES], membre),
        calculateRefus: this.calculateRefusFn(membre),
        categorie: Categorie.SITUATION_PERSONELLE,
        subcategorie: Subcategorie.NATIONALITE
      };
    });
  }

  private showQuestionsComplementairesFn(membre: Demandeur | MembreFamille) {
    return (value: any) => {
      const situation = value[`situationMembre_${membre.id}`];
      const nationalite = situation ? situation[`nationalite_${membre.id}`] : null;
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

  private toDate(dateAnswer: DateAnswer, membre: MembreFamille | Demandeur) {
    if (dateAnswer.shortcut && dateAnswer.shortcut.value === 'DEPUIS_NAISSANCE') {
      return membre.dateNaissance;
    } else {
      return dateAnswer.value;
    }
  }

  private calculateRefusFn(membre: MembreFamille | Demandeur): RefusEligibiliteFn {
    return (formData: FormData, eligibilites: Eligibilite[]) => {
      const answers = (formData[`situationMembre_${membre.id}`] as CompositeAnswer).answers;
      const nationaliteAnswer = answers[`nationalite_${membre.id}`] as NationaliteAnswer;

      // Si la personne à une nationalité Suisse, d'un Pays de l'UE/AELE ou est apatride pas de sortie d'éligibilité
      if (nationaliteAnswer.apatride || this.isAnswerSuisseOrUEorAELE(nationaliteAnswer)) {
        return [];
      }

      const dateArriveeSuisseAnswer = answers[`dateArriveeSuisse_${membre.id}`] as DateAnswer;
      const isDateArriveeInconnu = this.isDateInconnu(dateArriveeSuisseAnswer);
      const dateArriveEnSuisse: Date = this.toDate(dateArriveeSuisseAnswer, membre);

      // Si la personne habite en Suisse depuis plus de 10 ans (ou elle ne sait pas la date d'arrivée) pas de sortie
      // d'éligibilité.
      if (isDateArriveeInconnu || this.habiteEnSuisseDepuis(dateArriveEnSuisse, 10)) {
        return [];
      }

      const eligibiliteGroup = new EligibiliteGroup(eligibilites);
      const refus: EligibiliteRefusee[] = [];
      const refugieAnswer = (answers[`refugie_${membre.id}`] as OptionAnswer<RequerantRefugie>);
      const isReugie = refugieAnswer.value.value === RequerantRefugie.REFUGIE;

      if (this.habiteEnSuisseDepuis(dateArriveEnSuisse, 5)) {
        const isRefugieOrInconnu = isReugie || refugieAnswer.value.value === RequerantRefugie.INCONNU;

        // Si la personne habite en Suisse depuis plus de 5 (mais moins de 10) et qu'elle n'est pas réfugiée/inconnu ou
        // avec une nationalité d'un pays conventionné, elle a un refus PC AVS AI.
        if (!isRefugieOrInconnu && !this.isAnswerPaysConventionne(nationaliteAnswer)) {
          eligibiliteGroup.findByPrestationEtMembre(Prestation.PC_AVS_AI, membre).forEach(eligibilite => {
            refus.push({
              eligibilite: eligibilite,
              motif: {
                key: `question.situationMembre.dateArriveeSuisse.motifRefus.${Prestation.PC_AVS_AI}`,
                parameters: {who: membre.id === 0 ? 'me' : 'them', membre: membre.prenom}
              }
            });
          });
        }
      } else {
        // Refus PC AVS AI si la personne habite en Suisse depuis moins de 5 ans.
        eligibiliteGroup.findByPrestationEtMembre(Prestation.PC_AVS_AI, membre).forEach(eligibilite => {
          refus.push({
            eligibilite: eligibilite,
            motif: {
              key: `question.situationMembre.dateArriveeSuisse.motifRefus.${Prestation.PC_AVS_AI}`,
              parameters: {who: membre.id === 0 ? 'me' : 'them', membre: membre.prenom}
            }
          });
        });

        // Refus BOURSE si la personne habite en Suisse depuis moins de 5 ans et elle n'est pas réfugiée.
        if (!isReugie) {
          eligibiliteGroup.findByPrestationEtMembre(Prestation.BOURSES, membre).forEach(eligibilite => {
            refus.push({
              eligibilite: eligibilite,
              motif: {
                key: `question.situationMembre.dateArriveeSuisse.motifRefus.${Prestation.BOURSES}`,
                parameters: {who: membre.id === 0 ? 'me' : 'them', membre: membre.prenom}
              }
            });
          });
        }
      }

      return refus;
    };
  }
}
