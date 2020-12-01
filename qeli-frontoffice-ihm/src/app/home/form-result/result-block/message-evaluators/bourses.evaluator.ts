import { MessageEvaluator, ResultsByPrestation, TypeEligibilite } from '../result.model';
import { I18nString } from '../../../../core/i18n/i18nstring.model';
import { EvaluatorUtils } from '../evaluator-utils';

export class BoursesEvaluator implements MessageEvaluator {

  evaluate(type: TypeEligibilite, results: ResultsByPrestation): string | I18nString {
    const enfants11P = (EvaluatorUtils.getResultsDemandeur(results).enfants11P || []).map(enfant => enfant.prenom);
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
    return null;
  }

}
