import { Injectable } from '@angular/core';
import { QuestionLoader } from '../question-loader';
import { QuestionBase } from '../../../core/question/question-base.model';
import { Categorie, Subcategorie } from '../../../core/question/question-categorie.model';
import { Prestation } from '../../../core/common/prestation.model';
import { getNbrEnfantsACharge, hasConjoint, hasFortuneTropEleve } from '../qeli-questions.utils';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { RadioQuestion } from '../../../core/question/radio-question/radio-question.model';
import { ReponseBinaire, ReponseProgressive } from '../../../core/common/reponse.model';
import { TypeEnfant } from '../etat-civil/type-enfant.model';


@Injectable({
  providedIn: 'root'
})
export class MontantFortuneQuestionService implements QuestionLoader {

  loadQuestions(configuration: QeliConfiguration): QuestionBase<any>[] {
    return [
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
      })
    ];
  }
}
