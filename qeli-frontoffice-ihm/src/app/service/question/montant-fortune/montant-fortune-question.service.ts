import { Injectable } from '@angular/core';
import { QuestionLoader } from '../question-loader';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { QeliQuestionDecorator } from '../qeli-question-decorator.model';
import { Eligibilite } from '../eligibilite.model';


@Injectable({
  providedIn: 'root'
})
export class MontantFortuneQuestionService implements QuestionLoader {

  loadQuestions(configuration: QeliConfiguration, eligibilites: Eligibilite[]): QeliQuestionDecorator<any>[] {
    return [/*
      new RadioQuestion({
        key: 'fortuneSuperieureA',
        code: '1302',
        categorie: Categorie.COMPLEMENTS,
        subcategorie: Subcategorie.MONTANT_FORTUNE,
        help: true,
        inline: true,
        labelParameters: {
          limite: (value: any) => {
            const nbrEnfantsACharge = getNbrEnfantsACharge(value, Object.values(TypeEnfant));
            const limiteFortune = configuration.limiteFortune +
                                  (nbrEnfantsACharge * configuration.limiteFortunePerEnfant) +
                                  (hasConjoint(value) ? configuration.limiteFortuneConjoint : 0);

            return Math.min(limiteFortune, configuration.maxLimiteFortune);
          }
        },
        options: Object.keys(ReponseBinaire).map(label => ({label: label})),
        eligibilite: [
          {
            prestation: Prestation.AIDE_SOCIALE,
            isEligible: (value: any) => !hasFortuneTropEleve(value)
          }
        ]
      }),
      new RadioQuestion({
        key: 'impotFortune',
        code: '1301',
        categorie: Categorie.COMPLEMENTS,
        subcategorie: Subcategorie.MONTANT_FORTUNE,
        help: true,
        inline: true,
        options: Object.keys(ReponseProgressive).map(label => ({label: label})),
        skip: (value: any) => value['fortuneSuperieureA'] !== null && !hasFortuneTropEleve(value),
        eligibilite: [
          {
            prestation: Prestation.ALLOCATION_LOGEMENT,
            isEligible: (value: any) => value['impotFortune'] !== ReponseProgressive.OUI
          }
        ]
      })*/
    ];
  }
}
