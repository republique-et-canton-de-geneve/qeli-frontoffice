import { Injectable } from '@angular/core';
import { QuestionLoader } from '../question-loader';
import { QuestionBase } from '../../../dynamic-form/dynamic-question/question/question-base.model';
import { CheckboxGroupQuestion } from '../../../dynamic-form/dynamic-question/question/checkbox-group-question/checkbox-group-question.model';
import { Categorie, Subcategorie } from '../../../dynamic-form/dynamic-question/question/question-categorie.model';
import { Prestation } from '../../../dynamic-form/model/prestation.model';
import { hasAnyPrestations, hasPrestation } from '../qeli-questions.utils';
import { Demandeur, QeliConfiguration } from '../../configuration/qeli-configuration.model';

const PRESTATIONS_OPTIONS = Object.keys(Prestation).filter(
  prestation => prestation !== Prestation.PC_AVS_AI_CONJOINT &&
                prestation !== Prestation.PC_AVS_AI_ENFANTS
);

@Injectable({
  providedIn: 'root'
})
export class PrestationQuestionService implements QuestionLoader {

  loadQuestions(configuration: QeliConfiguration, demandeur: Demandeur): QuestionBase<any>[] {
    return [
      new CheckboxGroupQuestion({
        key: 'prestations',
        code: '0101',
        categorie: Categorie.SITUATION_PERSONELLE,
        subcategorie: Subcategorie.PRESTATION,
        help: true,
        hasNone: true,
        hasInconnu: true,
        options: PRESTATIONS_OPTIONS.map(prestation => ({label: prestation})),
        eligibilite: [
          {
            prestation: Prestation.SUBSIDES,
            isEligible: (value: any) => !hasAnyPrestations(
              value, [
                Prestation.SUBSIDES,
                Prestation.PC_AVS_AI,
                Prestation.PC_FAM,
                Prestation.AIDE_SOCIALE
              ]
            )
          },
          {
            prestation: Prestation.AVANCES,
            isEligible: (value: any) => !hasPrestation(value, Prestation.AVANCES)
          },
          {
            prestation: Prestation.ALLOCATION_LOGEMENT,
            isEligible: (value: any) => !hasAnyPrestations(
              value, [
                Prestation.ALLOCATION_LOGEMENT,
                Prestation.SUBVENTION_HM,
                Prestation.PC_AVS_AI
              ]
            )
          },
          {
            prestation: Prestation.PC_AVS_AI,
            isEligible: (value: any) => !hasAnyPrestations(
              value, [
                Prestation.PC_AVS_AI,
                Prestation.PC_FAM
              ]
            )
          },
          {
            prestation: Prestation.PC_AVS_AI_CONJOINT,
            isEligible: (value: any) => !hasAnyPrestations(
              value, [
                Prestation.PC_AVS_AI,
                Prestation.PC_FAM
              ]
            )
          },
          {
            prestation: Prestation.PC_AVS_AI_ENFANTS,
            isEligible: (value: any) => !hasAnyPrestations(
              value, [
                Prestation.PC_AVS_AI,
                Prestation.PC_FAM
              ]
            )
          },
          {
            prestation: Prestation.BOURSES,
            isEligible: (value: any) => !hasPrestation(value, Prestation.BOURSES)
          },
          {
            prestation: Prestation.PC_FAM,
            isEligible: (value: any) => !hasAnyPrestations(
              value, [
                Prestation.PC_AVS_AI,
                Prestation.PC_FAM
              ]
            )
          },
          {
            prestation: Prestation.AIDE_SOCIALE,
            isEligible: (value: any) => !hasPrestation(value, Prestation.AIDE_SOCIALE)
          }
        ]
      })
    ];
  }
}
