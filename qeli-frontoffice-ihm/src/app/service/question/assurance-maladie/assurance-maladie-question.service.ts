import { Injectable } from '@angular/core';
import { QuestionLoader } from '../question-loader';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { Demandeur } from '../../configuration/demandeur.model';
import { QeliQuestionDecorator } from '../qeli-question-decorator.model';

@Injectable({
  providedIn: 'root'
})
export class AssuranceMaladieQuestionService implements QuestionLoader {

  loadQuestions(configuration: QeliConfiguration, demandeur: Demandeur): QeliQuestionDecorator<any>[] {
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
