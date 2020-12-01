import { MessageEvaluator, ResultsByPrestation, TypeEligibilite } from '../result.model';
import { I18nString } from '../../../core/i18n/i18nstring.model';
import { Prestation } from '../../configuration/prestation.model';
import { EvaluatorUtils } from '../evaluator-utils';
import { FormData } from '../../../dynamic-question/model/question.model';
import { OptionAnswer } from '../../../dynamic-question/model/answer.model';
import { AnswerUtils } from '../answer-utils';

export class PcFamEvaluator implements MessageEvaluator {

  evaluate(type: TypeEligibilite, results: ResultsByPrestation, formData: FormData): string | I18nString {
    const answer = formData['taxationOffice'] as OptionAnswer<any>;
    if (EvaluatorUtils.isPrestationEligible(type) && AnswerUtils.isTaxationOffice(formData)) {
      return 'home.result.prestation.PC_FAM.taxationOffice';
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
