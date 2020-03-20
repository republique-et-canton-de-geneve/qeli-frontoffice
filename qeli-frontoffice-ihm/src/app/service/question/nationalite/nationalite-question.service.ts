import { NationaliteQuestion } from '../../../core/question/nationalite-question/nationalite-question.model';
import { Categorie, Subcategorie } from '../../../core/question/question-categorie.model';
import { Prestation } from '../../../core/common/prestation.model';
import { RadioQuestion } from '../../../core/question/radio-question/radio-question.model';
import { RequerantRefugie } from './requerant-refugie.model';
import { hasConjoint, isApatride, isRefugie, isRequerantAsile, isSuisse, isUEOrAELE } from '../qeli-questions.utils';
import { ReponseProgressive } from '../../../core/common/reponse.model';
import { Injectable } from '@angular/core';
import { QuestionLoader } from '../question-loader';
import { QuestionBase } from '../../../core/question/question-base.model';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';

@Injectable({
  providedIn: 'root'
})
export class NationaliteQuestionService implements QuestionLoader {

  loadQuestions(configuration: QeliConfiguration): QuestionBase<any>[] {
    return [
      new NationaliteQuestion({
        key: 'nationalite',
        code: '0401',
        categorie: Categorie.SITUATION_PERSONELLE,
        subcategorie: Subcategorie.NATIONALITE,
        help: true,
        eligibilite: [
          {prestation: Prestation.PC_AVS_AI},
          {prestation: Prestation.BOURSES}
        ]
      }),
      new RadioQuestion({
        key: 'refugie',
        code: '0402',
        categorie: Categorie.SITUATION_PERSONELLE,
        subcategorie: Subcategorie.NATIONALITE,
        options: [
          {label: RequerantRefugie.REQUERANT_ASILE, help: true},
          {label: RequerantRefugie.REFUGIE, help: true},
          {label: RequerantRefugie.AUCUN},
          {label: RequerantRefugie.INCONNU}
        ],
        skip: (value: any) => isSuisse(value) ||
                              isUEOrAELE(value) ||
                              isApatride(value),
        eligibilite: [
          {prestation: Prestation.PC_AVS_AI},
          {prestation: Prestation.BOURSES}
        ]
      }),
      new NationaliteQuestion({
        key: 'nationaliteConjoint',
        code: '0403',
        categorie: Categorie.SITUATION_PERSONELLE,
        subcategorie: Subcategorie.NATIONALITE,
        skip: (value: any) => !hasConjoint(value),
        help: true,
        eligibilite: [
          {prestation: Prestation.PC_AVS_AI_CONJOINT},
          {prestation: Prestation.BOURSES}
        ]
      }),
      new RadioQuestion({
        key: 'refugieConjoint',
        code: '0404',
        categorie: Categorie.SITUATION_PERSONELLE,
        subcategorie: Subcategorie.NATIONALITE,
        options: [
          {label: RequerantRefugie.REQUERANT_ASILE, help: true},
          {label: RequerantRefugie.REFUGIE, help: true},
          {label: RequerantRefugie.AUCUN},
          {label: RequerantRefugie.INCONNU}
        ],
        skip: (value: any) => !hasConjoint(value) ||
                              isSuisse(value, 'nationaliteConjoint') ||
                              isUEOrAELE(value, 'nationaliteConjoint') ||
                              isApatride(value, 'nationaliteConjoint'),
        eligibilite: [
          {prestation: Prestation.PC_AVS_AI_CONJOINT},
          {prestation: Prestation.BOURSES}
        ]
      }),
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
      })
    ];
  }
}
