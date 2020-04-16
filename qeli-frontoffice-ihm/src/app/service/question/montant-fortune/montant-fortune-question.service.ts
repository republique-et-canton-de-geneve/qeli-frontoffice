import { Injectable } from '@angular/core';
import { QuestionLoader, QuestionUtils } from '../question-loader';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { Categorie, QeliQuestionDecorator, Subcategorie } from '../qeli-question-decorator.model';
import { Eligibilite, EligibiliteGroup } from '../eligibilite.model';
import { RadioQuestion } from '../../../dynamic-question/radio-question/radio-question.model';
import {
  REPONSE_BINAIRE_OPTIONS, REPONSE_PROGRESSIVE_OPTIONS, ReponseBinaire, ReponseProgressive
} from '../reponse-binaire.model';
import { Prestation } from '../../configuration/prestation.model';
import { FormData } from '../../../dynamic-question/model/question.model';
import { OptionAnswer } from '../../../dynamic-question/model/answer.model';
import { I18nString } from '../../../core/i18n/i18nstring.model';


@Injectable({
  providedIn: 'root'
})
export class MontantFortuneQuestionService implements QuestionLoader {

  loadQuestions(configuration: QeliConfiguration, eligibilites: Eligibilite[]): QeliQuestionDecorator<any>[] {
    const eligibiliteGroup = new EligibiliteGroup(eligibilites);
    return [{
      question: new RadioQuestion({
        key: 'fortuneSuperieureA',
        dataCyIdentifier: '1302_fortuneSuperieureA',
        label: () => {
          const demandeur = eligibiliteGroup.demandeur;
          // TODO determiner les enfants à charge avec la question de enFormation
          // Enfant à charge : -18 ans ou entre 18-25 en formation
          const nbrEnfantsACharge = demandeur.enfants.length;
          const limiteFortune = configuration.limiteFortune +
                                (nbrEnfantsACharge * configuration.limiteFortunePerEnfant) +
                                (demandeur.hasConjoint ? configuration.limiteFortuneConjoint : 0);

          return {
            key: 'question.fortuneSuperieureA.label',
            parameters: {limite: Math.min(limiteFortune, configuration.maxLimiteFortune)}
          } as I18nString;
        },
        help: {key: 'question.fortuneSuperieureA.help'},
        inline: true,
        radioOptions: REPONSE_BINAIRE_OPTIONS
      }),
      calculateRefus: QuestionUtils.rejectPrestationByOptionAnswerFn(
        'fortuneSuperieureA',
        ReponseBinaire.OUI,
        Prestation.AIDE_SOCIALE,
        {key: `question.fortuneSuperieureA.motifRefus.${Prestation.AIDE_SOCIALE}`}
      ),
      eligibilites: eligibiliteGroup.findByPrestation(Prestation.AIDE_SOCIALE),
      categorie: Categorie.COMPLEMENTS,
      subcategorie: Subcategorie.MONTANT_FORTUNE
    }, {
      question: new RadioQuestion({
        key: 'impotFortune',
        dataCyIdentifier: '1301_impotFortune',
        label: {
          key: 'question.impotFortune.label',
          parameters: {limite: 8000}
        },
        help: {
          key: 'question.impotFortune.help',
          parameters: {limite: 8000}
        },
        inline: true,
        radioOptions: REPONSE_PROGRESSIVE_OPTIONS
      }),
      skip: formData => formData.hasOwnProperty('fortuneSuperieureA') &&
                        !this.hasFortuneTropEleve(formData),
      calculateRefus: QuestionUtils.rejectPrestationByOptionAnswerFn(
        'impotFortune',
        ReponseProgressive.OUI,
        Prestation.ALLOCATION_LOGEMENT,
        {key: `question.impotFortune.motifRefus.${Prestation.AIDE_SOCIALE}`}
      ),
      eligibilites: eligibiliteGroup.findByPrestation(Prestation.ALLOCATION_LOGEMENT),
      categorie: Categorie.COMPLEMENTS,
      subcategorie: Subcategorie.MONTANT_FORTUNE
    }];
  }

  private hasFortuneTropEleve(formData: FormData) {
    const choosenOption = (formData['fortuneSuperieureA'] as OptionAnswer<string>).value;
    return choosenOption.value === ReponseBinaire.OUI;
  }
}
