import { QuestionLoader } from '../question-loader';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { Categorie, QeliQuestionDecorator, RefusEligibiliteFn, Subcategorie } from '../qeli-question-decorator.model';
import { Eligibilite, EligibiliteGroup, EligibiliteRefusee } from '../eligibilite.model';
import {
  CompositeAnswer, CompositeQuestion
} from '../../../dynamic-question/composite-question/composite-question.model';
import { Prestation } from '../../configuration/prestation.model';
import { NationaliteQuestion } from '../../../dynamic-question/nationalite-question/nationalite-question.model';
import { RadioQuestion } from '../../../dynamic-question/radio-question/radio-question.model';
import { DateAnswer, DateQuestion } from '../../../dynamic-question/date-question/date-question.model';
import * as moment from 'moment';
import { Personne } from '../../configuration/demandeur.model';
import { FormData } from '../../../dynamic-question/model/question.model';
import { Pays, PAYS_AELE_UE, PAYS_CONVENTIONES } from '../../../dynamic-question/nationalite-question/pays.model';
import { QuestionUtils } from '../qeli-questions.utils';
import { DropdownQuestion } from '../../../dynamic-question/dropdown-question/dropdown-question.model';
import {
  TypePermis, typePermisBOptions, typePermisCOptions, typePermisFOptions, typePermisOptions
} from './type-permis.model';
import { AnswerUtils } from '../answer-utils';

export class NationaliteQuestionService extends QuestionLoader {

  loadQuestions(configuration: QeliConfiguration): QeliQuestionDecorator<any>[] {
    const eligibiliteGroup = new EligibiliteGroup(this.demandeur.toEligibilite());
    const membres: Personne[] = ([this.demandeur] as Personne[]).concat(
      this.demandeur.membresFamille
    );

    let questions: QeliQuestionDecorator<any>[] = [{
      question: new CompositeQuestion({
        key: 'nationalite',
        dataCyIdentifier: '0401_nationalite',
        label: {key: 'question.nationalite.label'},
        help: {key: 'question.nationalite.help'},
        showErrors: false,
        items: membres.map(membre => {
          const translateParams = {
            who: membre.id === 0 ? 'me' : 'them',
            membre: membre.prenom
          };

          return {
            question: new NationaliteQuestion({
              key: `nationalite_${membre.id}`,
              dataCyIdentifier: `0401_nationalite_${membre.id}`,
              label: {key: 'question.nationalite.membre', parameters: translateParams},
              errorLabels: {
                required: {key: 'question.nationalite.error.required', parameters: translateParams}
              }
            })
          };
        })
      }),
      eligibilites: eligibiliteGroup.findByPrestation([Prestation.PC_AVS_AI, Prestation.BOURSES]),
      calculateRefus: () => [],
      categorie: Categorie.SITUATION_PERSONELLE,
      subcategorie: Subcategorie.NATIONALITE
    }];

    return questions.concat(membres.map(membre => {
      const translateParams = {
        who: membre.id === 0 ? 'me' : 'them',
        membre: membre.prenom
      };

      return {
        question: new CompositeQuestion({
          key: `situationPermis_${membre.id}`,
          dataCyIdentifier: `0406_situationPermis_${membre.id}`,
          label: {key: 'question.situationPermis.label', parameters: translateParams},
          showErrors: false,
          items: [
            {
              question: new DropdownQuestion({
                key: 'typePermis',
                dataCyIdentifier: `0407_typePermis_${membre.id}`,
                label: {key: 'question.situationPermis.typePermis.label', parameters: translateParams},
                errorLabels: {
                  required: {key: 'question.situationPermis.typePermis.error.required', parameters: translateParams}
                },
                someOptions: [
                  {
                    value: 'OUI',
                    label: {
                      key: 'question.situationPermis.typePermis.some',
                      parameters: translateParams
                    }
                  },
                  {value: 'INCONNU', label: {key: 'question.situationPermis.typePermis.inconnu'}}
                ],
                dropdownOptions: typePermisOptions()
              })
            },
            {
              question: new RadioQuestion({
                key: 'complementPermisB',
                dataCyIdentifier: `0408_complementPermisB_${membre.id}`,
                label: {key: 'question.situationPermis.complementPermisB.label', parameters: translateParams},
                errorLabels: {
                  required: {
                    key: 'question.situationPermis.complementPermisB.error.required', parameters: translateParams
                  }
                },
                radioOptions: typePermisBOptions()
              }),
              isShown: this.isPermisFn(membre, TypePermis.B).bind(this)
            },
            {
              question: new RadioQuestion({
                key: 'complementPermisC',
                dataCyIdentifier: `0408_complementPermisC_${membre.id}`,
                label: {key: 'question.situationPermis.complementPermisC.label', parameters: translateParams},
                errorLabels: {
                  required: {
                    key: 'question.situationPermis.complementPermisC.error.required', parameters: translateParams
                  }
                },
                radioOptions: typePermisCOptions()
              }),
              isShown: this.isPermisFn(membre, TypePermis.C).bind(this)
            },
            {
              question: new RadioQuestion({
                key: 'complementPermisF',
                dataCyIdentifier: `0408_complementPermisF_${membre.id}`,
                label: {key: 'question.situationPermis.complementPermisF.label', parameters: translateParams},
                errorLabels: {
                  required: {
                    key: 'question.situationPermis.complementPermisF.error.required', parameters: translateParams
                  }
                },
                radioOptions: typePermisFOptions()
              }),
              isShown: this.isPermisFn(membre, TypePermis.F).bind(this)
            },
            {
              question: new DateQuestion({
                key: 'dateArriveeSuisse',
                dataCyIdentifier: `0409_dateArriveeSuisse_${membre.id}`,
                label: {key: 'question.situationPermis.dateArriveeSuisse.label', parameters: translateParams},
                minDate: moment().subtract(configuration.minYearsFromNow, 'year').toDate(),
                maxDate: new Date(),
                errorLabels: QuestionUtils.toErrorLabels(
                  'situationPermis.dateArriveeSuisse',
                  ['required', 'maxDate', 'minDate', 'invalidDate'],
                  translateParams
                ),
                shortcuts: ['NO_SHORTCUT', 'DEPUIS_NAISSANCE', 'INCONNU'].map(shortcut => ({
                  value: shortcut,
                  label: {
                    key: `question.situationPermis.dateArriveeSuisse.shortcut.${shortcut}`,
                    parameters: translateParams
                  }
                }))
              })
            }
          ]
        }),
        eligibilites: eligibiliteGroup.findByPrestationEtMembre([Prestation.PC_AVS_AI, Prestation.BOURSES], membre),
        skip: formData => AnswerUtils.isNationalite(formData, membre, Pays.CH),
        calculateRefus: this.calculateSituationPermisRefusFn(membre),
        categorie: Categorie.SITUATION_PERSONELLE,
        subcategorie: Subcategorie.NATIONALITE
      };
    }));
  }

  private isPermisFn(membre: Personne, typePermis: TypePermis) {
    return (value: any) => {
      const situation = value[`situationPermis_${membre.id}`];
      const selectedType = situation ? situation['typePermis'] : null;
      return selectedType && selectedType.value === typePermis;
    };
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

  private calculateSituationPermisRefusFn(membre: Personne): RefusEligibiliteFn {
    return (formData: FormData, eligibilites: Eligibilite[]) => {
      const situationPermis = (formData[`situationPermis_${membre.id}`] as CompositeAnswer).answers;

      // Si la personne à une nationalité Suisse, d'un Pays de l'UE/AELE ou est apatride pas de sortie d'éligibilité
      if (AnswerUtils.isApatride(formData, membre) ||
          AnswerUtils.isNationalite(formData, membre, Pays.CH) ||
          AnswerUtils.isNationaliteIn(formData, membre, PAYS_AELE_UE)) {
        return [];
      }

      const dateArriveeSuisseAnswer = situationPermis['dateArriveeSuisse'] as DateAnswer;
      const isDateArriveeInconnu = this.isDateInconnu(dateArriveeSuisseAnswer);
      const dateArriveEnSuisse: Date = this.toDate(dateArriveeSuisseAnswer, membre);

      // Si la personne habite en Suisse depuis plus de 10 ans (ou elle ne sait pas la date d'arrivée) pas de sortie
      // d'éligibilité.
      if (isDateArriveeInconnu || this.habiteEnSuisseDepuis(dateArriveEnSuisse, 10)) {
        return [];
      }

      const refus: EligibiliteRefusee[] = [];
      const isReugie = AnswerUtils.isRefugie(formData, membre);
      const eligibiliteToMotifFn = eligibilite => ({
        key: `question.situationPermis.dateArriveeSuisse.motifRefus.${eligibilite.prestation}`,
        parameters: {who: membre.id === 0 ? 'me' : 'them', membre: membre.prenom}
      });

      if (this.habiteEnSuisseDepuis(dateArriveEnSuisse, 5)) {
        // Si la personne habite en Suisse depuis plus de 5 (mais moins de 10) et qu'elle n'est pas réfugiée ou
        // avec une nationalité d'un pays conventionné, elle a un refus PC AVS AI.
        if (isReugie && !AnswerUtils.isNationaliteIn(formData, membre, PAYS_CONVENTIONES)) {
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
