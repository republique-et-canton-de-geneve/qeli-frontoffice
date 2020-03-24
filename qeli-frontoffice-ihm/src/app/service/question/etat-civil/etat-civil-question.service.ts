import { Injectable } from '@angular/core';
import { QuestionLoader } from '../question-loader';
import { QuestionBase } from '../../../core/question/question-base.model';
import { Categorie, Subcategorie } from '../../../core/question/question-categorie.model';
import { Prestation } from '../../../core/common/prestation.model';
import { hasAnyEnfantOfType, hasConjoint, hasEnfants } from '../qeli-questions.utils';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { DropdownQuestion } from '../../../core/question/dropdown-question/dropdown-question.model';
import { EtatCivil } from './etat-civil.model';
import {
  NumberField, NumberGroupQuestion
} from '../../../core/question/number-group-question/number-group-question.model';
import { TypeEnfant } from './type-enfant.model';
import { RadioQuestion } from '../../../core/question/radio-question/radio-question.model';
import { ReponseBinaire } from '../../../core/common/reponse.model';

@Injectable({
  providedIn: 'root'
})
export class EtatCivilQuestionService implements QuestionLoader {

  loadQuestions(configuration: QeliConfiguration): QuestionBase<any>[] {
    return [
      new DropdownQuestion({
        key: 'etatCivil',
        code: '0301',
        categorie: Categorie.SITUATION_PERSONELLE,
        subcategorie: Subcategorie.ETAT_CIVIL,
        help: true,
        options: Object.keys(EtatCivil),
        eligibilite: [
          {
            prestation: Prestation.PC_AVS_AI_CONJOINT,
            isEligible: (value: any) => hasConjoint(value)
          },
          {prestation: Prestation.BOURSES},
          {prestation: Prestation.PC_FAM},
          {prestation: Prestation.AIDE_SOCIALE}
        ]
      }),
      new NumberGroupQuestion({
        key: 'enfantsACharge',
        code: '0505',
        categorie: Categorie.SITUATION_PERSONELLE,
        subcategorie: Subcategorie.ETAT_CIVIL,
        help: true,
        hasNone: true,
        fields: Object.keys(TypeEnfant).map(
          prestation => new NumberField({label: prestation, max: configuration.maxEnfantsACharge, min: 0})
        ),
        eligibilite: [
          {
            prestation: Prestation.PC_FAM,
            isEligible: (value: any) => hasAnyEnfantOfType(value, [
              TypeEnfant.MOINS_18,
              TypeEnfant.ENTRE_18_25_EN_FORMATION
            ])
          },
          {
            prestation: Prestation.PC_AVS_AI_ENFANTS,
            isEligible: (value: any) => hasAnyEnfantOfType(value, [
              TypeEnfant.MOINS_18,
              TypeEnfant.ENTRE_18_25_EN_FORMATION
            ])
          },
          {prestation: Prestation.BOURSES},
          {prestation: Prestation.AIDE_SOCIALE}
        ]
      }),
      new RadioQuestion({
        key: 'concubinageAutreParent',
        code: '0506',
        categorie: Categorie.SITUATION_PERSONELLE,
        subcategorie: Subcategorie.ETAT_CIVIL,
        help: true,
        inline: true,
        skip: (value: any) => hasConjoint(value) || !hasEnfants(value),
        options: Object.keys(ReponseBinaire).map(label => ({label: label})),
        eligibilite: [
          {prestation: Prestation.PC_FAM}
        ]
      })
    ];
  }
}
