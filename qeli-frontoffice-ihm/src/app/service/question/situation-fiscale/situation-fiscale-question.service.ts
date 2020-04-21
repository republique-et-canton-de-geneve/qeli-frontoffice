import { Injectable } from '@angular/core';
import { QuestionLoader } from '../question-loader';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { Categorie, QeliQuestionDecorator, Subcategorie } from '../qeli-question-decorator.model';
import { Eligibilite, EligibiliteGroup, EligibiliteRefusee } from '../eligibilite.model';
import { Personne } from '../../configuration/demandeur.model';
import {
  CompositeAnswer, CompositeQuestion
} from '../../../dynamic-question/composite-question/composite-question.model';
import { Prestation } from '../../configuration/prestation.model';
import { RadioQuestion } from '../../../dynamic-question/radio-question/radio-question.model';
import { REPONSE_PROGRESSIVE_OPTIONS, ReponseProgressive } from '../reponse-binaire.model';
import { AnswerUtils } from '../answer-utils';
import { OptionAnswer } from '../../../dynamic-question/model/answer.model';
import { FormData } from '../../../dynamic-question/model/question.model';

@Injectable({
  providedIn: 'root'
})
export class SituationFiscaleQuestionService implements QuestionLoader {

  loadQuestions(configuration: QeliConfiguration, eligibilites: Eligibilite[]): QeliQuestionDecorator<any>[] {
    const eligibiliteGroup = new EligibiliteGroup(eligibilites);
    const membres: Personne[] = ([eligibiliteGroup.demandeur] as Personne[]).concat(
      eligibiliteGroup.demandeur.membresFamille
    );

    return [{
      question: new CompositeQuestion({
        key: 'parentsHabiteFranceTravailleSuisse',
        dataCyIdentifier: '1404_parentsHabiteFranceTravailleSuisse',
        label: {key: 'question.parentsHabiteFranceTravailleSuisse.label'},
        help: {key: 'question.parentsHabiteFranceTravailleSuisse.help'},
        showErrors: false,
        items: membres.map(membre => {
          const translateParams = {
            who: membre.id === 0 ? 'me' : 'them',
            membre: membre.prenom
          };

          return {
            question: new RadioQuestion({
              key: `parentsHabiteFranceTravailleSuisse_${membre.id}`,
              dataCyIdentifier: `1404_parentsHabiteFranceTravailleSuisse_${membre.id}`,
              label: {key: 'question.parentsHabiteFranceTravailleSuisse.membre', parameters: translateParams},
              errorLabels: {
                required: {key: 'question.parentsHabiteFranceTravailleSuisse.error.required'}
              },
              radioOptions: REPONSE_PROGRESSIVE_OPTIONS,
              inline: true
            }),
            isShown: (value: any) => {
              const answers = value['permisBEtudes'];
              const permisBEtudes = answers ? answers[`permisBEtudes_${membre.id}`] : null;
              console.log(answers);
              return permisBEtudes && permisBEtudes === ReponseProgressive.OUI;
            }
          };
        })
      }),
      eligibilites: eligibiliteGroup.findByPrestation(Prestation.BOURSES),
      skip: formData => {
        return !membres.some(membre => {
          return AnswerUtils.hasPermisBEtudes(formData, membre);
        });
      },
      calculateRefus: this.calculateRefusParentsHabiteFranceTravailleSuisse,
      categorie: Categorie.COMPLEMENTS,
      subcategorie: Subcategorie.SITUATION_FISCALE
    }];
  }

  private calculateRefusParentsHabiteFranceTravailleSuisse(
    formData: FormData, eligibilites: Eligibilite[]
  ): EligibiliteRefusee[] {
    const eligibiliteGroup = new EligibiliteGroup(eligibilites);
    const answers = (formData[`parentsHabiteFranceTravailleSuisse`] as CompositeAnswer).answers;

    return eligibiliteGroup.findByPrestation(Prestation.BOURSES).map(eligibilite => {
      const currentAnswer = answers[`parentsHabiteFranceTravailleSuisse_${eligibilite.membre.id}`] as OptionAnswer<string>;
      if (currentAnswer !== null && currentAnswer !== undefined) {
        const choosenOption = currentAnswer.value;
        if (choosenOption.value === ReponseProgressive.NON) {
          return {
            eligibilite: eligibilite,
            motif: {
              key: `question.parentsHabiteFranceTravailleSuisse.motifRefus.${eligibilite.prestation}`,
              parameters: {who: eligibilite.membre.id === 0 ? 'me' : 'them', membre: eligibilite.membre.prenom}
            }
          } as EligibiliteRefusee;
        }
      }

      return null;
    }).filter(eligibiliteRefusee => eligibiliteRefusee !== null && eligibiliteRefusee !== undefined);
  }
}


/*
new RadioQuestion({
  key: 'exempteImpot',
  code: '1401',
  categorie: Categorie.COMPLEMENTS,
  subcategorie: Subcategorie.SITUATION_FISCALE,
  help: true,
  inline: true,
  options: Object.keys(ReponseProgressive).map(label => ({label: label})),
  eligibilite: [
    {
      prestation: Prestation.SUBSIDES,
      isEligible: (value: any) => value['exempteImpot'] !== ReponseProgressive.OUI
    }
  ]
}),
new RadioQuestion({
  key: 'taxeOfficeAFC',
  code: '1402',
  categorie: Categorie.COMPLEMENTS,
  subcategorie: Subcategorie.SITUATION_FISCALE,
  help: true,
  inline: true,
  labelParameters: {
    annee: moment().subtract(configuration.taxationAfcYearsFromNow, 'year').get('year')
  },
  options: Object.keys(ReponseProgressive).map(label => ({label: label})),
  eligibilite: [
    {
      prestation: Prestation.SUBSIDES,
      isEligible: (value: any) => value['taxeOfficeAFC'] !== ReponseProgressive.OUI
    }
  ]
}),
new RadioQuestion({
  key: 'fonctionnaireInternational',
  code: '1403',
  categorie: Categorie.COMPLEMENTS,
  subcategorie: Subcategorie.SITUATION_FISCALE,
  help: true,
  inline: true,
  options: Object.keys(ReponseProgressive).map(label => ({label: label})),
  altText: value => hasConjoint(value) ? 'avecConjoint' : null,
  skip: (value: any) => isRefugie(value),
  eligibilite: [
    {
      prestation: Prestation.BOURSES,
      isEligible: (value: any) => !isFonctionnaireInternational(value)
    }
  ]
})*/
