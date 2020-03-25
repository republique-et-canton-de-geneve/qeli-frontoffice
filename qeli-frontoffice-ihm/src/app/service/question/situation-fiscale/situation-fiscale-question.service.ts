import { Injectable } from '@angular/core';
import { QuestionLoader } from '../question-loader';
import { QuestionBase } from '../../../dynamic-form/dynamic-question/question/question-base.model';
import { Categorie, Subcategorie } from '../../../dynamic-form/dynamic-question/question/question-categorie.model';
import { Prestation } from '../../../dynamic-form/model/prestation.model';
import { hasConjoint, hasPermisBEtudes, isFonctionnaireInternational, isRefugie } from '../qeli-questions.utils';
import * as moment from 'moment';
import { Demandeur, QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { RadioQuestion } from '../../../dynamic-form/dynamic-question/question/radio-question/radio-question.model';
import { ReponseProgressive } from '../../../dynamic-form/model/reponse.model';

@Injectable({
  providedIn: 'root'
})
export class SituationFiscaleQuestionService implements QuestionLoader {

  loadQuestions(configuration: QeliConfiguration, demandeur: Demandeur): QuestionBase<any>[] {
    return [
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
      }),
      new RadioQuestion({
        key: 'parentsHabiteFranceTravailleSuisse',
        code: '1404',
        categorie: Categorie.COMPLEMENTS,
        subcategorie: Subcategorie.SITUATION_FISCALE,
        help: true,
        inline: true,
        options: Object.keys(ReponseProgressive).map(label => ({label: label})),
        skip: (value: any) => !hasPermisBEtudes(value),
        eligibilite: [
          {
            prestation: Prestation.BOURSES,
            isEligible: (value: any) => value['parentsHabiteFranceTravailleSuisse'] !== ReponseProgressive.NON
          }
        ]
      })
    ];
  }
}
