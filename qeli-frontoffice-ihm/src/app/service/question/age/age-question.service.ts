import { Injectable } from '@angular/core';
import { QuestionLoader } from '../question-loader';
import { QuestionBase } from '../../../core/question/question-base.model';
import { Categorie, Subcategorie } from '../../../core/question/question-categorie.model';
import { Prestation } from '../../../core/common/prestation.model';
import { isMineur } from '../qeli-questions.utils';
import { DateQuestion } from '../../../core/question/date-question/date-question.model';
import * as moment from 'moment';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';

@Injectable({
  providedIn: 'root'
})
export class AgeQuestionService implements QuestionLoader {

  loadQuestions(configuration: QeliConfiguration): QuestionBase<any>[] {
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
