import { MessageEvaluator, ResultsByPrestation, TypeEligibilite } from '../result.model';
import { Prestation } from '../../../../service/configuration/prestation.model';
import { EvaluatorUtils } from '../evaluator-utils';
import { I18nString } from '../../../../core/i18n/i18nstring.model';

export class PcAvsAiEvaluator implements MessageEvaluator {

  evaluate(type: TypeEligibilite, results: ResultsByPrestation): string | I18nString {
    if (EvaluatorUtils.isPrestationRefusee(type) && EvaluatorUtils.hasConcubin(results)) {
      return {
        key: 'home.result.verifierConcubin',
        parameters: {
          prestation: Prestation.PC_AVS_AI
        }
      };
    }
  }

}
