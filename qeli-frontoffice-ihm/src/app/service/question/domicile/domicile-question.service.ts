import { Injectable } from '@angular/core';
import { QuestionLoader } from '../question-loader';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { Categorie, QeliQuestionDecorator, Subcategorie } from '../qeli-question-decorator.model';
import { Eligibilite, EligibiliteGroup, EligibiliteRefusee } from '../eligibilite.model';
import { Relation } from '../../configuration/demandeur.model';
import { RadioQuestion } from '../../../dynamic-question/radio-question/radio-question.model';
import { Prestation } from '../../configuration/prestation.model';
import { ReponseProgressive } from '../reponse-binaire.model';

@Injectable({
  providedIn: 'root'
})
export class DomicileQuestionService implements QuestionLoader {

  loadQuestions(configuration: QeliConfiguration, eligibilites: Eligibilite[]): QeliQuestionDecorator<any>[] {
    const eligibiliteGroup = new EligibiliteGroup(eligibilites);

    return [
      {
        question: new RadioQuestion( {
          key: 'domicileCantonGEConjoint',
          dataCyIdentifier: '0510_domicileCantonGEConjoint',
          label: {
            key: 'question.domicileCantonGEConjoint.label'
          },
          radioOptions: Object.keys(ReponseProgressive).map(reponseProgressive => ({
            value: reponseProgressive,
            label: {key: `question.reponseProgressive.option.${reponseProgressive}`}
          }))
        }),
        calculateRefus: this.calculateRefus.bind(this),
        eligibilites: eligibiliteGroup.findByPrestationEtRelationIn(Prestation.PC_FAM,
          [Relation.PARTENAIRE_ENREGISTRE, Relation.EPOUX, Relation.CONCUBIN])
                      || eligibiliteGroup.findByPrestationEtRelationIn(Prestation.PC_AVS_AI,
            [Relation.PARTENAIRE_ENREGISTRE, Relation.EPOUX, Relation.CONCUBIN]),
        categorie: Categorie.SITUATION_PERSONELLE,
        subcategorie: Subcategorie.DOMICILE

      }
    ];
  }

  calculateRefus(formData: FormData, eligibilites: Eligibilite[]): EligibiliteRefusee[] {

    const refus: EligibiliteRefusee[] = eligibilites.map(eligibilite => {

      if (formData['domicileCantonGEConjoint'].value === ReponseProgressive.NON) {
        return {
          eligibilite: eligibilite, motif: {key: `question.domicileCantonGEConjoint.motifRefus.PC_FAM`}
        } as EligibiliteRefusee;
      }

      return null;
    }).filter(eligibilciteRefusee => eligibilciteRefusee !== null);
    return refus;
  }
}


    /*
     questions: conjoints.map(conjoint => new RadioQuestion({
          key: `domicileCantonGEConjoint_${conjoint.id}`,
          dataCyIdentifier: `0510_domicileCantonGEConjoint_${conjoint.id}`,
          label: {
            key: 'home.setup.membre.relation.label'
          },

    new RadioQuestion({
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

