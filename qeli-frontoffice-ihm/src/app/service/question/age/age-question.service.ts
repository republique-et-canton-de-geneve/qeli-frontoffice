import { Injectable } from '@angular/core';
import { QuestionLoader } from '../question-loader';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { Demandeur } from '../../configuration/demandeur.model';
import { QeliQuestionDecorator } from '../qeli-question-decorator.model';

@Injectable({
  providedIn: 'root'
})
export class AgeQuestionService implements QuestionLoader {

  loadQuestions(configuration: QeliConfiguration, demandeur: Demandeur): QeliQuestionDecorator<any>[] {
    return /*[
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
    ];*/
  }
}
