import { Injectable } from '@angular/core';
import { QuestionLoader, QuestionUtils } from '../question-loader';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { Categorie, QeliQuestionDecorator, Subcategorie } from '../qeli-question-decorator.model';
import { Eligibilite, EligibiliteGroup, EligibiliteRefusee } from '../eligibilite.model';
import { Demandeur, MembreFamille, Relation } from '../../configuration/demandeur.model';
import { RadioQuestion } from '../../../dynamic-question/radio-question/radio-question.model';
import { Prestation } from '../../configuration/prestation.model';
import { ReponseBinaire, ReponseProgressive } from '../reponse-binaire.model';
import { DateAnswer, DateQuestion } from '../../../dynamic-question/date-question/date-question.model';
import * as moment from 'moment';
import { OptionAnswer } from '../../../dynamic-question/model/answer.model';
import { FormData } from '../../../dynamic-question/model/question.model';

@Injectable({
  providedIn: 'root'
})
export class DomicileQuestionService implements QuestionLoader {

  loadQuestions(configuration: QeliConfiguration, eligibilites: Eligibilite[]): QeliQuestionDecorator<any>[] {
    const eligibiliteGroup = new EligibiliteGroup(eligibilites);
    const membres = ([eligibiliteGroup.demandeur] as (MembreFamille | Demandeur)[]).concat(
      eligibiliteGroup.demandeur.membresFamille.filter(
        membre => membre.relation === Relation.PARTENAIRE_ENREGISTRE ||
                  membre.relation === Relation.EPOUX ||
                  membre.relation === Relation.CONCUBIN
      )
    );

    const questions = membres.map((membre): QeliQuestionDecorator<any>[] => {
      const translateParams = {who: membre.id === 0 ? 'me' : 'them', membre: membre.prenom};
      return [{
        question: new RadioQuestion({
          key: `domicileCantonGE_${membre.id}`,
          dataCyIdentifier: `0501_domicileCantonGE_${membre.id}`,
          label: {
            key: 'question.domicileCantonGE.label',
            parameters: translateParams
          },
          inline: true,
          radioOptions: Object.keys(ReponseProgressive).map(reponse => ({
            value: reponse,
            label: {key: `common.reponseProgressive.${reponse}`}
          }))
        }),
        calculateRefus: this.calculateDomicileCantonGERefusFn(membre),
        eligibilites: eligibiliteGroup.findByPrestationEtMembre([Prestation.PC_FAM,
                                                                 Prestation.AVANCES,
                                                                 Prestation.ALLOCATION_LOGEMENT,
                                                                 Prestation.AIDE_SOCIALE], membre),
        categorie: Categorie.SITUATION_PERSONELLE,
        subcategorie: Subcategorie.DOMICILE
      }, {
        question: new DateQuestion({
          key: `dateArriveeGeneve_${membre.id}`,
          dataCyIdentifier: `0502_dateArriveeGeneve_${membre.id}`,
          label: {
            key: 'question.dateArriveeGeneve.label',
            parameters: translateParams
          },
          maxDate: new Date(),
          minDate: moment().subtract(configuration.minYearsFromNow, 'year').toDate(),
          errorLabels: {
            required: {
              key: 'question.dateArriveeGeneve.error.required',
              parameters: translateParams
            },
            maxDate: {
              key: 'question.dateArriveeGeneve.error.maxDate',
              parameters: translateParams
            },
            minDate: {
              key: 'question.dateArriveeGeneve.error.minDate',
              parameters: translateParams
            },
            invalidDate: {
              key: 'question.dateArriveeGeneve.error.invalidDate',
              parameters: translateParams
            }
          },
          shortcuts: ['NO_SHORTCUT', 'DEPUIS_NAISSANCE', 'INCONNU'].map(shortcut => ({
            value: shortcut,
            label: {
              key: `question.dateArriveeGeneve.shortcut.${shortcut}`,
              parameters: translateParams
            }
          }))
        }),
        calculateRefus: this.calculatesDateArriveeGeneveRefusFn(membre),
        eligibilites: eligibiliteGroup.findByPrestationEtMembre(Prestation.PC_FAM, membre),
        categorie: Categorie.SITUATION_PERSONELLE,
        subcategorie: Subcategorie.DOMICILE
      }];
    }).reduce((result, current) => result.concat(current), []);

    questions.push({
      question: new RadioQuestion({
        key: 'residenceEffectiveCantonGE',
        dataCyIdentifier: '0504_residenceEffectiveCantonGE',
        label: {key: 'question.residenceEffectiveCantonGE.label'},
        help: {key: 'question.residenceEffectiveCantonGE.help'},
        inline: true,
        radioOptions: Object.keys(ReponseBinaire).map(reponse => ({
          value: reponse,
          label: {key: `common.reponseBinaire.${reponse}`}
        }))
      }),
      calculateRefus: QuestionUtils.rejectPrestationByOptionAnswerFn(
        'residenceEffectiveCantonGE',
        ReponseBinaire.NON,
        Prestation.AIDE_SOCIALE,
        {key: `question.residenceEffectiveCantonGE.motifRefus.${Prestation.AIDE_SOCIALE}`}
      ),
      eligibilites: eligibiliteGroup.findByPrestation(Prestation.AIDE_SOCIALE),
      categorie: Categorie.SITUATION_PERSONELLE,
      subcategorie: Subcategorie.DOMICILE
    });

    return questions;
  }

  private calculateDomicileCantonGERefusFn(membre: MembreFamille | Demandeur) {
    return (formData: FormData, eligibilites: Eligibilite[]): EligibiliteRefusee[] => {
      const choosenOption = (formData[`domicileCantonGE_${membre.id}`] as OptionAnswer<string>).value;

      if (choosenOption.value === ReponseProgressive.NON) {
        const eligibiliteGroup = new EligibiliteGroup(eligibilites);
        return eligibiliteGroup.findByPrestationEtMembre([
          Prestation.PC_FAM, Prestation.AVANCES, Prestation.ALLOCATION_LOGEMENT, Prestation.AIDE_SOCIALE
        ], membre).map(eligibilite => ({
          eligibilite: eligibilite,
          motif: {
            key: `question.domicileCantonGE.motifRefus.${eligibilite.prestation}`,
            parameters: {who: membre.id === 0 ? 'me' : 'them', membre: membre.prenom}
          }
        }));
      }

      return [];
    };
  }

  private calculatesDateArriveeGeneveRefusFn(membre: MembreFamille | Demandeur) {
    return (formData: FormData, eligibilites: Eligibilite[]): EligibiliteRefusee[] => {
      const dateArriveeGeneveAnswer = formData[`dateArriveeGeneve_${membre.id}`] as DateAnswer;
      const isDateArriveeInconnu = this.isDateInconnu(dateArriveeGeneveAnswer);
      const dateArriveeGeneve: Date = this.toDate(dateArriveeGeneveAnswer, membre);

      // Si la personne habite en Suisse depuis plus de 10 ans (ou elle ne sait pas la date d'arrivée) pas de sortie
      // d'éligibilité.
      if (this.habiteGeneveDepuis(dateArriveeGeneve, 5)) {
        return [];
      } else {
        const eligibiliteGroup = new EligibiliteGroup(eligibilites);
        return eligibiliteGroup.findByPrestationEtMembre(Prestation.PC_FAM, membre).map(eligibilite => ({
          eligibilite: eligibilite,
          motif: {
            key: `question.dateArriveeGeneve.motifRefus.${eligibilite.prestation}`,
            parameters: {who: membre.id === 0 ? 'me' : 'them', membre: membre.prenom}
          }
        }));
      }
    }
  }

  private habiteGeneveDepuis(dateArriveeGeneve: Date, years: number) {
    return moment().subtract(years, 'year')
                   .endOf('day')
                   .isAfter(moment(dateArriveeGeneve));
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
}

