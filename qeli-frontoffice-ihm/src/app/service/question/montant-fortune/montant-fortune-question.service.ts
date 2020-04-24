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
import { Demandeur } from '../../configuration/demandeur.model';
import { TypeEnfant } from '../enfants/type-enfant.model';


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
        label: (value: any) => {
          const demandeur = eligibiliteGroup.demandeur;
          const nbrEnfantsACharge = this.getNombreEnfantsACharge(value, demandeur);
          const limiteFortune = configuration.limiteFortune +
                                (nbrEnfantsACharge * configuration.limiteFortunePerEnfant) +
                                (demandeur.hasConjoint ? configuration.limiteFortuneConjoint : 0);

          return {
            key: 'question.fortuneSuperieureA.label',
            parameters: {limite: Math.min(limiteFortune, configuration.maxLimiteFortune)}
          } as I18nString;
        },
        help: {key: 'question.fortuneSuperieureA.help'},
        errorLabels: {required: {key: 'question.fortuneSuperieureA.error.required'}},
        inline: true,
        radioOptions: REPONSE_BINAIRE_OPTIONS
      }),
      calculateRefus: QuestionUtils.rejectPrestationByOptionAnswerFn(
        'fortuneSuperieureA',
        ReponseBinaire.OUI,
        Prestation.AIDE_SOCIALE,
        eligibilite => ({key: `question.fortuneSuperieureA.motifRefus.${eligibilite.prestation}`})
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
        errorLabels: {required: {key: 'question.impotFortune.error.required'}},
        inline: true,
        radioOptions: REPONSE_PROGRESSIVE_OPTIONS
      }),
      skip: formData => formData.hasOwnProperty('fortuneSuperieureA') &&
                        !this.hasFortuneTropEleve(formData),
      calculateRefus: QuestionUtils.rejectPrestationByOptionAnswerFn(
        'impotFortune',
        ReponseProgressive.OUI,
        Prestation.ALLOCATION_LOGEMENT,
        eligibilite => ({key: `question.impotFortune.motifRefus.${eligibilite.prestation}`})
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

  private getNombreEnfantsACharge(value: any, demandeur: Demandeur) {
    const parentsEnfantsAnswers = value['parentsEnfants'];
    const formationAnswers = value['formation'];
    return demandeur.enfants.filter(enfant =>
      parentsEnfantsAnswers[`parentsEnfants_${enfant.id}`] === TypeEnfant.LES_DEUX ||
      parentsEnfantsAnswers[`parentsEnfants_${enfant.id}`] === TypeEnfant.MOI
    ).filter(enfant =>
      !enfant.isMajeur ||
      (enfant.age <= 25 && formationAnswers[`formation_${enfant.id}`] === ReponseBinaire.OUI)
    ).length;
  }
}
