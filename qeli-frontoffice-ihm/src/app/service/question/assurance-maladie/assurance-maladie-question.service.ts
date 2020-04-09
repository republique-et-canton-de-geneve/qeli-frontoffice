import { Injectable } from '@angular/core';
import { QuestionLoader } from '../question-loader';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { QeliQuestionDecorator } from '../qeli-question-decorator.model';
import { Eligibilite } from '../eligibilite.model';

@Injectable({
  providedIn: 'root'
})
export class AssuranceMaladieQuestionService implements QuestionLoader {

  loadQuestions(configuration: QeliConfiguration, eligibilites: Eligibilite[]): QeliQuestionDecorator<any>[] {
    return /*[
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
    ];*/
  }
}
