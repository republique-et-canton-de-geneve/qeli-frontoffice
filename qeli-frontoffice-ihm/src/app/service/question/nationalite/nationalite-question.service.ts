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
import { Pays, PAYS_AELE_UE } from '../../../dynamic-question/nationalite-question/pays.model';

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
                      key: `question.situationMembre.refugie.option.${RequerantRefugie.REQUERANT_ASILE}.label`,
                      parameters: translateParams
                    },
                    help: {
                      key: `question.situationMembre.refugie.option.${RequerantRefugie.REQUERANT_ASILE}.help`,
                      parameters: translateParams
                    }
                  },
                  {
                    value: RequerantRefugie.REFUGIE,
                    label: {
                      key: `question.situationMembre.refugie.option.${RequerantRefugie.REFUGIE}.label`,
                      parameters: translateParams
                    },
                    help: {
                      key: `question.situationMembre.refugie.option.${RequerantRefugie.REFUGIE}.help`,
                      parameters: translateParams
                    }
                  },
                  {
                    value: RequerantRefugie.AUCUN,
                    label: {
                      key: `question.situationMembre.refugie.option.${RequerantRefugie.AUCUN}`,
                      parameters: translateParams
                    }
                  },
                  {
                    value: RequerantRefugie.INCONNU,
                    label: {
                      key: `question.situationMembre.refugie.option.${RequerantRefugie.INCONNU}`,
                      parameters: translateParams
                    }
                  }
                ]
              }),
              isShown: value => !this.isSuisseOrUEOrAELE(value[`nationalite_${membre.id}`].pays || [])
            },
            {
              question: new DateQuestion({
                key: `dateArriveeSuisse_${membre.id}`,
                dataCyIdentifier: `0507_refugie_${membre.id}`,
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
              isShown: value => !this.isSuisseOrUEOrAELE(value[`nationalite_${membre.id}`].pays || [])
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

  private isSuisseOrUEOrAELE(pays: Pays[]) {
    return pays.some(value => value === Pays.CH || PAYS_AELE_UE.includes(value));
  }

  private isAnswerSuisseOrUEorAELE(answer: NationaliteAnswer) {
    return this.isSuisseOrUEOrAELE(answer.pays.map(option => option.value));
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

      // Si la personne à une nationalité Suisse ou d'un Pays de l'UE ou AELE pas de sortie d'éligibilité
      if (!nationaliteAnswer.apatride && this.isAnswerSuisseOrUEorAELE(nationaliteAnswer)) {
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
      const isRefugieOrInconnu = isReugie || refugieAnswer.value.value === RequerantRefugie.INCONNU;

      if (!this.habiteEnSuisseDepuis(dateArriveEnSuisse, 5)) {
        if (!isRefugieOrInconnu) {
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

/*
new RadioQuestion({
  key: 'permisBEtudes',
  code: '0405',
  categorie: Categorie.SITUATION_PERSONELLE,
  subcategorie: Subcategorie.NATIONALITE,
  help: true,
  inline: true,
  options: Object.keys(ReponseProgressive).map(label => ({label: label})),
  skip: (value: any) => isSuisse(value) ||
                        isRefugie(value) ||
                        isRequerantAsile(value) ||
                        isApatride(value),
  eligibilite: [
    {prestation: Prestation.BOURSES}
  ]
})*/
