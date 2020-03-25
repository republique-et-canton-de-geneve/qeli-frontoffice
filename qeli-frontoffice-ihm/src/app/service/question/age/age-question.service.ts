import { Injectable } from '@angular/core';
import { QuestionLoader } from '../question-loader';
import { QuestionBase } from '../../../dynamic-form/dynamic-question/question/question-base.model';
import { Categorie, Subcategorie } from '../../../dynamic-form/dynamic-question/question/question-categorie.model';
import { Prestation } from '../../../dynamic-form/model/prestation.model';
import { isMineur } from '../qeli-questions.utils';
import { DateQuestion } from '../../../dynamic-form/dynamic-question/question/date-question/date-question.model';
import * as moment from 'moment';
import { Demandeur, QeliConfiguration } from '../../configuration/qeli-configuration.model';

@Injectable({
  providedIn: 'root'
})
export class AgeQuestionService implements QuestionLoader {

  loadQuestions(configuration: QeliConfiguration, demandeur: Demandeur): QuestionBase<any>[] {
    return [
      new DateQuestion({
        key: 'dateNaissance',
        code: '0201',
        categorie: Categorie.SITUATION_PERSONELLE,
        subcategorie: Subcategorie.AGE,
        help: true,
        maxDate: new Date(),
        minDate: moment().subtract(configuration.minYearsFromNow, 'year').toDate(),
        eligibilite: [
          {prestation: Prestation.SUBSIDES},
          {prestation: Prestation.AVANCES},
          {prestation: Prestation.ALLOCATION_LOGEMENT},
          {prestation: Prestation.PC_AVS_AI},
          {prestation: Prestation.BOURSES},
          {prestation: Prestation.PC_FAM},
          {
            prestation: Prestation.AIDE_SOCIALE,
            isEligible: (value: any) => !isMineur(value)
          }
        ]
      })
    ];
  }
}
