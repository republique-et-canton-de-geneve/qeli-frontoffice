import { Injectable } from '@angular/core';
import { QuestionLoader } from '../question-loader';
import { QuestionBase } from '../../../dynamic-form/dynamic-question/question/question-base.model';
import { Categorie, Subcategorie } from '../../../dynamic-form/dynamic-question/question/question-categorie.model';
import { Prestation } from '../../../dynamic-form/model/prestation.model';
import { Demandeur, QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { RadioQuestion } from '../../../dynamic-form/dynamic-question/question/radio-question/radio-question.model';
import { ReponseProgressive } from '../../../dynamic-form/model/reponse.model';

@Injectable({
  providedIn: 'root'
})
export class AssuranceMaladieQuestionService implements QuestionLoader {

  loadQuestions(configuration: QeliConfiguration, demandeur: Demandeur): QuestionBase<any>[] {
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
