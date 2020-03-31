import { Injectable } from '@angular/core';
import { QuestionLoader } from '../question-loader';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { QeliQuestionDecorator } from '../qeli-question-decorator.model';
import { Eligibilite } from '../eligibilite.model';

@Injectable({
  providedIn: 'root'
})
export class PensionAlimentaireQuestionService implements QuestionLoader {

  loadQuestions(configuration: QeliConfiguration, eligibilites: Eligibilite[]): QeliQuestionDecorator<any>[] {
    return [/*
      new RadioQuestion({
        key: 'droitPensionAlimentaire',
        code: '1201',
        categorie: Categorie.COMPLEMENTS,
        subcategorie: Subcategorie.PENSION_ALIMENTAIRE,
        help: true,
        inline: true,
        options: Object.keys(ReponseBinaire).map(label => ({label: label})),
        eligibilite: [
          {
            prestation: Prestation.AVANCES,
            isEligible: (value: any) => value['droitPensionAlimentaire'] === ReponseBinaire.OUI
          }
        ]
      }),
      new RadioQuestion({
        key: 'recoisEntierementPensionAlimentaire',
        code: '1202',
        categorie: Categorie.COMPLEMENTS,
        subcategorie: Subcategorie.PENSION_ALIMENTAIRE,
        help: true,
        inline: true,
        options: Object.keys(ReponseBinaire).map(label => ({label: label})),
        eligibilite: [
          {
            prestation: Prestation.AVANCES,
            isEligible: (value: any) => value['recoisEntierementPensionAlimentaire'] === ReponseBinaire.NON
          }
        ]
      })*/
    ];
  }
}
