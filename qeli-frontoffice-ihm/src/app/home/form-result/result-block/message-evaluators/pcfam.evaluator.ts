import { MessageEvaluator, ResultsByPrestation, TypeEligibilite } from '../result.model';
import { I18nString } from '../../../../core/i18n/i18nstring.model';
import { Prestation } from '../../../../service/configuration/prestation.model';
import { EvaluatorUtils } from '../evaluator-utils';

export class PcFamEvaluator implements MessageEvaluator {

  evaluate(type: TypeEligibilite, results: ResultsByPrestation): string | I18nString {
    if (EvaluatorUtils.isPrestationEligible(type) && !EvaluatorUtils.isPrestationIndividuel(results)) {
      return 'home.result.prestation.PC_FAM.explication';
    }
    if (EvaluatorUtils.isPrestationRefusee(type) && EvaluatorUtils.hasConcubinAvecEnfantsPropres(results)) {
      return {
        key: 'home.result.verifierConcubin',
        parameters: {
          prestation: Prestation.PC_FAM
        }
      };
    }
    return null;
  }

}
