import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Prestation } from '../../../service/configuration/prestation.model';
import { TranslateService } from '@ngx-translate/core';
import {
  MessageEvaluatorByPrestation, Result, ResultsByPrestation, TypeEligibilite
} from '../../../service/question/result.model';
import { EvaluatorUtils } from './evaluator-utils';
import { BoursesEvaluator } from './message-evaluators/bourses.evaluator';
import { PcAvsAiEvaluator } from './message-evaluators/pcavsai.evaluator';
import { PcFamEvaluator } from './message-evaluators/pcfam.evaluator';

@Component({
  selector: 'result-block',
  templateUrl: './result-block.component.html',
  styleUrls: ['./result-block.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultBlockComponent {
  @Input() resultsByPrestation: ResultsByPrestation;
  @Input() type: TypeEligibilite;

  private readonly exportBlockMessageEvaluators: MessageEvaluatorByPrestation = {
    [Prestation.PC_FAM]: new PcFamEvaluator(),
    [Prestation.PC_AVS_AI]: new PcAvsAiEvaluator(),
    [Prestation.BOURSES]: new BoursesEvaluator()
  };

  constructor(private translateService: TranslateService) {

  }

  get isPrestationRefusee() {
    return EvaluatorUtils.isPrestationRefusee(this.type);
  }

  get isPrestationDejaPercue() {
    return EvaluatorUtils.isPrestationDejaPercue(this.type);
  }

  get isPrestationEligible() {
    return EvaluatorUtils.isPrestationEligible(this.type);
  }

  get isPrestationIndividuel() {
    return this.resultsByPrestation.prestation === Prestation.SUBSIDES ||
           this.resultsByPrestation.prestation === Prestation.BOURSES;
  }

  get informationMessage() {
    const messageEvaluator = this.exportBlockMessageEvaluators[this.resultsByPrestation.prestation];

    return messageEvaluator ? messageEvaluator.evaluate(this.type, this.resultsByPrestation) : null;
  }

  toTranslateParams(result: Result) {
    return {who: result.membre.id === 0 ? 'me' : 'them', membre: result.membre.prenom};
  }

  translateResult(result: Result) {
    const resultAsString = (result) => {
      return result.eligible ? 'eligible' : (result.dejaPercue ? 'dejaPercue' : 'refusee');
    };

    return this.translateService.instant(
      `home.result.prestation.${this.resultsByPrestation.prestation}.${resultAsString(result)}`,
      this.toTranslateParams(result)
    );
  }
}
