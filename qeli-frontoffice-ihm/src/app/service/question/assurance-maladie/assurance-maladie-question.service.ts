import { Injectable } from '@angular/core';
import { QuestionLoader } from '../question-loader';
import { QuestionBase } from '../../../core/question/question-base.model';
import { Categorie, Subcategorie } from '../../../core/question/question-categorie.model';
import { Prestation } from '../../../core/common/prestation.model';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { RadioQuestion } from '../../../core/question/radio-question/radio-question.model';
import { ReponseProgressive } from '../../../core/common/reponse.model';

@Injectable({
  providedIn: 'root'
})
export class AssuranceMaladieQuestionService implements QuestionLoader {

  loadQuestions(configuration: QeliConfiguration): QuestionBase<any>[] {
    return [
      new RadioQuestion({
        key: 'assuranceMaladieSuisse',
        code: '1101',
        categorie: Categorie.COMPLEMENTS,
        subcategorie: Subcategorie.ASSURANCE_MALADIE,
        help: true,
        inline: true,
        options: Object.keys(ReponseProgressive).map(label => ({label: label})),
        eligibilite: [
          {
            prestation: Prestation.SUBSIDES,
            isEligible: (value: any) => value['assuranceMaladieSuisse'] !== ReponseProgressive.NON
          }
        ]
      })
    ];
  }
}
