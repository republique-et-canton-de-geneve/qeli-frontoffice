import { MessageEvaluator, ResultsByPrestation, TypeEligibilite } from '../result.model';
import { I18nString } from '../../../core/i18n/i18nstring.model';
import { EvaluatorUtils } from '../evaluator-utils';
import { FormData } from '../../../dynamic-question/model/question.model';
import { Demandeur } from '../../configuration/demandeur.model';
import { AnswerUtils } from '../answer-utils';
import { Scolarite } from '../formation/scolarite.model';

export class BoursesEvaluator implements MessageEvaluator {

  evaluate(type: TypeEligibilite, results: ResultsByPrestation, formData: FormData): string | I18nString {
    const demandeur = EvaluatorUtils.getResultsDemandeur(results).membre as Demandeur;
    const enfants11P = demandeur
      .enfants
      .filter(enfant => AnswerUtils.isScolarite(formData, enfant.id, Scolarite.SCOLARITE_OBLIGATOIRE_11P))
      .map(enfant => enfant.prenom);

    if (enfants11P && enfants11P.length) {
      return {
        key: 'home.result.prestation.BOURSES.information11P',
        parameters: {
          nombreEnfants11P: enfants11P.length,
          enfants11P: enfants11P.reduce(
            (res, enf, idx, all) => `${res}${res ? (idx === all.length - 1 ? " et " : ", ") : ""}${enf}`,
            ''
          )
        }
      };
    }

    const refusRevenusChommage = results
      .results
      // Attention: ici on se base sur le libellé du motif de refus
      // pour pas complexifier le code d'avantage.
      // Veuillez adapter  si la valeur de refus change.
      .some(result => !result.eligible && result.motifRefus.key === 'question.revenus.motifRefus.BOURSES');
    if (refusRevenusChommage) {
      return 'home.result.prestation.BOURSES.informationChomage';
    }
    return null;
  }

}
