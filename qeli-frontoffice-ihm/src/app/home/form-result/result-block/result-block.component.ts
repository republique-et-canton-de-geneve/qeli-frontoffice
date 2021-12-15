/*
 * qeli-frontoffice
 *
 * Copyright (C) 2019-2021 Republique et canton de Geneve
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Prestation } from '../../../service/configuration/prestation.model';
import { TranslateService } from '@ngx-translate/core';
import {
  MessageEvaluatorByPrestation, Result, ResultsByPrestation, TypeEligibilite
} from '../../../service/question/result.model';
import { EvaluatorUtils } from '../../../service/question/evaluator-utils';
import { BoursesEvaluator } from '../../../service/question/message-evaluators/bourses.evaluator';
import { PcAvsAiEvaluator } from '../../../service/question/message-evaluators/pcavsai.evaluator';
import { PcFamEvaluator } from '../../../service/question/message-evaluators/pcfam.evaluator';
import { FormData } from '../../../dynamic-question/model/question.model';

@Component({
  selector: 'result-block',
  templateUrl: './result-block.component.html',
  styleUrls: ['./result-block.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultBlockComponent {
  @Input() resultsByPrestation: ResultsByPrestation;
  @Input() type: TypeEligibilite;
  @Input() formData: FormData;

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

    return messageEvaluator ? messageEvaluator.evaluate(this.type, this.resultsByPrestation, this.formData) : null;
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
