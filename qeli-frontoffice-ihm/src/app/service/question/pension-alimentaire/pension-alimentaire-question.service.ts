import { Injectable } from '@angular/core';
import { QuestionLoader } from '../question-loader';
import { QuestionBase } from '../../../core/question/question-base.model';
import { Categorie, Subcategorie } from '../../../core/question/question-categorie.model';
import { Prestation } from '../../../core/common/prestation.model';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { RadioQuestion } from '../../../core/question/radio-question/radio-question.model';
import { ReponseBinaire } from '../../../core/common/reponse.model';

@Injectable({
  providedIn: 'root'
})
export class PensionAlimentaireQuestionService implements QuestionLoader {

  loadQuestions(configuration: QeliConfiguration): QuestionBase<any>[] {
    return [
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
      })
    ];
  }
}
