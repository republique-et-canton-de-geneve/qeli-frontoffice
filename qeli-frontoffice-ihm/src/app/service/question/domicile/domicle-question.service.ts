import { Injectable } from '@angular/core';
import { QuestionLoader } from '../question-loader';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { Demandeur } from '../../configuration/demandeur.model';
import { QeliQuestionDecorator } from '../qeli-question-decorator.model';

@Injectable({
  providedIn: 'root'
})
export class DomicileQuestionService implements QuestionLoader {

  loadQuestions(configuration: QeliConfiguration, demandeur: Demandeur): QeliQuestionDecorator<any>[] {
    return [
      /*new RadioQuestion({
        key: 'domicileCantonGE',
        code: '0501',
        categorie: Categorie.SITUATION_PERSONELLE,
        subcategorie: Subcategorie.DOMICILE,
        help: true,
        inline: true,
        options: Object.keys(ReponseProgressive).map(label => ({label: label})),
        eligibilite: [
          {
            prestation: Prestation.AVANCES,
            isEligible: (value: any) => ReponseProgressive.NON !== value['domicileCantonGE']
          },
          {
            prestation: Prestation.ALLOCATION_LOGEMENT,
            isEligible: (value: any) => ReponseProgressive.NON !== value['domicileCantonGE']
          },
          // TODO On en fait rien de cette donée
          {prestation: Prestation.PC_AVS_AI},
          {
            prestation: Prestation.PC_FAM,
            isEligible: (value: any) => ReponseProgressive.NON !== value['domicileCantonGE']
          },
          {
            prestation: Prestation.AIDE_SOCIALE,
            isEligible: (value: any) => ReponseProgressive.NON !== value['domicileCantonGE']
          }
        ]
      }),
      new DateQuestion({
        key: 'dateArriveeGeneve',
        code: '0502',
        categorie: Categorie.SITUATION_PERSONELLE,
        subcategorie: Subcategorie.DOMICILE,
        help: true,
        maxDate: new Date(),
        minDate: moment().subtract(configuration.minYearsFromNow, 'year').toDate(),
        shortcuts: [
          {label: 'DEPUIS_NAISSANCE'},
          {label: 'INCONNU'}
        ],
        eligibilite: [
          {
            prestation: Prestation.PC_FAM,
            isEligible: (value: any) => habiteGeneveDepuis5ans(value)
          }
        ]
      }),
      new RadioQuestion({
        key: 'residenceEffectiveCantonGE',
        code: '0504',
        categorie: Categorie.SITUATION_PERSONELLE,
        subcategorie: Subcategorie.DOMICILE,
        help: true,
        inline: true,
        options: Object.keys(ReponseBinaire).map(label => ({label: label})),
        eligibilite: [
          {
            prestation: Prestation.AIDE_SOCIALE,
            isEligible: (value: any) => value['residenceEffectiveCantonGE'] !== ReponseBinaire.NON
          }
        ]
      }),
      new DateQuestion({
        key: 'dateArriveeSuisse',
        code: '0507',
        categorie: Categorie.SITUATION_PERSONELLE,
        subcategorie: Subcategorie.DOMICILE,
        help: true,
        maxDate: new Date(),
        minDate: moment().subtract(configuration.minYearsFromNow, 'year').toDate(),
        shortcuts: [
          {label: 'DEPUIS_NAISSANCE'},
          {label: 'INCONNU'}
        ],
        skip: (value: any, prestationsEligibles: Prestation[]) =>
          isSuisse(value) ||
          isUEOrAELE(value) ||
          (prestationsEligibles === [Prestation.BOURSES] && isRefugie(value)),
        defaultAnswer: (value: any) =>
          habiteGeneveDepuisNaissance(value) ? {value: null, shortcut: 'DEPUIS_NAISSANCE'} : null,
        eligibilite: [
          {
            prestation: Prestation.BOURSES,
            isEligible: (value: any) => habiteSuisseDepuis(value, 5) || isRefugie(value)
          },
          {
            prestation: Prestation.PC_AVS_AI,
            isEligible: (value: any) => habiteSuisseDepuis(value, 10) ||
                                        (habiteSuisseDepuis(value, 5) && isRefugieOrInconnu(value))
          }
        ]
      }),
      new DateQuestion({
        key: 'dateArriveeSuisseConjoint',
        code: '0509',
        categorie: Categorie.SITUATION_PERSONELLE,
        subcategorie: Subcategorie.DOMICILE,
        help: true,
        maxDate: new Date(),
        minDate: moment().subtract(configuration.minYearsFromNow, 'year').toDate(),
        shortcuts: [{label: 'INCONNU'}],
        skip: (value: any) => isSuisse(value, 'nationaliteConjoint') ||
                              isUEOrAELE(value, 'nationaliteConjoint'),
        eligibilite: [
          {
            prestation: Prestation.PC_AVS_AI_CONJOINT,
            isEligible: (value: any) => conjointHabiteSuisseDepuis(value, 10) ||
                                        (
                                          conjointHabiteSuisseDepuis(value, 5) &&
                                          isRefugieOrInconnu(value, 'refugieConjoint')
                                        )
          }
        ]
      })*/
    ];
  }
}
