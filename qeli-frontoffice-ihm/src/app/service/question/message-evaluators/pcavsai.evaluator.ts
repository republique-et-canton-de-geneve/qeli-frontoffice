import { MessageEvaluator, ResultsByPrestation, TypeEligibilite } from '../result.model';
import { Prestation } from '../../configuration/prestation.model';
import { EvaluatorUtils } from '../evaluator-utils';
import { I18nString } from '../../../core/i18n/i18nstring.model';
import { FormData } from '../../../dynamic-question/model/question.model';

export class PcAvsAiEvaluator implements MessageEvaluator {

  evaluate(type: TypeEligibilite, results: ResultsByPrestation, formData: FormData): string | I18nString {
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
