import { Injectable } from '@angular/core';
import { QuestionLoader } from '../question-loader';
import { QuestionBase } from '../../../core/question/question-base.model';
import { Categorie, Subcategorie } from '../../../core/question/question-categorie.model';
import { Prestation } from '../../../core/common/prestation.model';
import {
  hasAnyAVSOrAIRevenus, hasAnyEnfantOfType, hasAnyRevenus, hasConjoint, isConcubinageAutreParent, isPaysNonConventione,
  isSituationRenteNone
} from '../qeli-questions.utils';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { CheckboxGroupQuestion } from '../../../core/question/checkbox-group-question/checkbox-group-question.model';
import { TypeRevenus } from './revenus.model';
import { SituationRente } from './situation-rente.model';
import { TypeEnfant } from '../etat-civil/type-enfant.model';

const REVENUS_OPTIONS = [
  {label: TypeRevenus.EMPLOI},
  {label: TypeRevenus.CHOMAGE},
  {
    label: 'AVS', options: [
      {label: TypeRevenus.AVS_RETRAITE},
      {label: TypeRevenus.AVS_VEUF},
      {label: TypeRevenus.AVS_ENFANT}
    ]
  },

  {
    label: 'AI', options: [
      {label: TypeRevenus.AI_ENFANT},
      {label: TypeRevenus.AI_INVALIDITE}
    ]
  },
  {label: TypeRevenus.APG, help: true}
];


@Injectable({
  providedIn: 'root'
})
export class RevenusQuestionService implements QuestionLoader {

  loadQuestions(configuration: QeliConfiguration): QuestionBase<any>[] {
    return [
      new CheckboxGroupQuestion({
        key: 'revenus',
        code: '0601',
        categorie: Categorie.SITUATION_PERSONELLE,
        subcategorie: Subcategorie.REVENUS,
        hasNone: true,
        options: REVENUS_OPTIONS,
        eligibilite: [
          {
            prestation: Prestation.BOURSES,
            isEligible: (value: any) => !hasAnyRevenus(value, [
              TypeRevenus.CHOMAGE,
              TypeRevenus.AVS_RETRAITE,
              TypeRevenus.AI_INVALIDITE
            ])
          },
          {
            prestation: Prestation.PC_AVS_AI,
            isEligible: (value: any) => hasAnyAVSOrAIRevenus(value) ||
                                        !isPaysNonConventione(value)
          },
          {
            prestation: Prestation.PC_FAM,
            isEligible: (value: any) => !hasAnyAVSOrAIRevenus(value)
          },
          {
            prestation: Prestation.AIDE_SOCIALE,
            isEligible: (value: any) => !hasAnyAVSOrAIRevenus(value)
          }
        ]
      }),
      new CheckboxGroupQuestion({
        key: 'situationRente',
        code: '0805',
        categorie: Categorie.SITUATION_PERSONELLE,
        subcategorie: Subcategorie.REVENUS,
        hasNone: true,
        options: [
          {label: SituationRente.RECONNU_OCAI, help: true},
          {label: SituationRente.RETRAITE_SANS_RENTE},
          {label: SituationRente.VEUF_SANS_RENTE}
        ],
        skip: (value: any) => hasAnyAVSOrAIRevenus(value),
        eligibilite: [
          {
            prestation: Prestation.PC_AVS_AI,
            isEligible: (value: any) => !isSituationRenteNone(value)
          }
        ]
      }),
      new CheckboxGroupQuestion({
        key: 'revenusConjoint',
        code: '0602',
        categorie: Categorie.SITUATION_PERSONELLE,
        subcategorie: Subcategorie.REVENUS,
        hasNone: true,
        options: REVENUS_OPTIONS,
        skip: (value: any, prestationsEligibles: Prestation[]) =>
          !hasConjoint(value) ||
          (
            prestationsEligibles.includes(Prestation.PC_AVS_AI) &&
            !(
              prestationsEligibles.includes(Prestation.PC_FAM) ||
              prestationsEligibles.includes(Prestation.AIDE_SOCIALE)
            )
          ),
        eligibilite: [
          {
            prestation: Prestation.PC_AVS_AI_CONJOINT,
            isEligible: (value: any) => hasAnyAVSOrAIRevenus(value, 'revenusConjoint') ||
                                        !isPaysNonConventione(value, 'nationaliteConjoint')
          },
          {
            prestation: Prestation.PC_FAM,
            isEligible: (value: any) => !hasAnyAVSOrAIRevenus(value, 'revenusConjoint')
          },
          {
            prestation: Prestation.AIDE_SOCIALE,
            isEligible: (value: any) => !hasAnyAVSOrAIRevenus(value, 'revenusConjoint')
          }
        ]
      }),
      new CheckboxGroupQuestion({
        key: 'situationRenteConjoint',
        code: '0806',
        categorie: Categorie.SITUATION_PERSONELLE,
        subcategorie: Subcategorie.REVENUS,
        hasNone: true,
        options: [
          {label: SituationRente.RECONNU_OCAI, help: true},
          {label: SituationRente.RETRAITE_SANS_RENTE}
        ],
        skip: (value: any, prestationsEligibles: Prestation[]) =>
          hasAnyAVSOrAIRevenus(value, 'revenusConjoint') ||
          prestationsEligibles.includes(Prestation.PC_AVS_AI),
        eligibilite: [
          {
            prestation: Prestation.PC_AVS_AI_CONJOINT,
            isEligible: (value: any) => !isSituationRenteNone(value, 'situationRenteConjoint')
          }
        ]
      }),
      new CheckboxGroupQuestion({
        key: 'revenusConcubin',
        code: '0603',
        categorie: Categorie.SITUATION_PERSONELLE,
        subcategorie: Subcategorie.REVENUS,
        hasNone: true,
        options: REVENUS_OPTIONS,
        skip: (value: any) => !isConcubinageAutreParent(value),
        eligibilite: [
          {
            prestation: Prestation.PC_FAM,
            isEligible: (value: any) => !hasAnyAVSOrAIRevenus(value, 'revenusConcubin')
          }
        ]
      }),

      new CheckboxGroupQuestion({
        key: 'revenusEnfant',
        code: '0604',
        categorie: Categorie.SITUATION_PERSONELLE,
        subcategorie: Subcategorie.REVENUS,
        hasNone: true,
        options: REVENUS_OPTIONS,
        skip: (value: any, prestationsEligibles: Prestation[]) =>
          prestationsEligibles.includes(Prestation.PC_AVS_AI) ||
          prestationsEligibles.includes(Prestation.PC_AVS_AI_CONJOINT),
        eligibilite: [
          {
            prestation: Prestation.PC_AVS_AI_ENFANTS,
            isEligible: (value: any) => hasAnyAVSOrAIRevenus(value, 'revenusEnfant') ||
                                        hasAnyEnfantOfType(value, [TypeEnfant.ENTRE_18_25_EN_FORMATION])
          }
        ]
      }),
      new CheckboxGroupQuestion({
        key: 'situationRenteEnfant',
        code: '0807',
        categorie: Categorie.SITUATION_PERSONELLE,
        subcategorie: Subcategorie.REVENUS,
        hasNone: true,
        options: [
          {label: SituationRente.RECONNU_OCAI, help: true}
        ],
        skip: (value: any, prestationsEligibles: Prestation[]) =>
          hasAnyAVSOrAIRevenus(value, 'revenusEnfant') ||
          prestationsEligibles.includes(Prestation.PC_AVS_AI) ||
          prestationsEligibles.includes(Prestation.PC_AVS_AI_CONJOINT),
        eligibilite: [
          {
            prestation: Prestation.PC_AVS_AI_ENFANTS,
            isEligible: (value: any) => !isSituationRenteNone(value, 'situationRenteEnfant')
          }
        ]
      })
    ];
  }
}
