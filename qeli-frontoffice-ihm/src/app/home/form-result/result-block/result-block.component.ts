import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Prestation } from '../../../service/configuration/prestation.model';
import { TranslateService } from '@ngx-translate/core';
import { MessageEvaluatorByPrestation, Result, ResultsByPrestation } from './result.model';
import { Demandeur } from '../../../service/configuration/demandeur.model';

@Component({
  selector: 'result-block',
  templateUrl: './result-block.component.html',
  styleUrls: ['./result-block.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultBlockComponent {
  @Input() resultsByPrestation: ResultsByPrestation;
  @Input() type: 'eligible' | 'refusee' | 'dejaPercue';

  private readonly exportBlockMessageEvaluators: MessageEvaluatorByPrestation = {
    [Prestation.PC_FAM]: () => {
      if (this.isPrestationEligible && !this.isPrestationIndividuel) {
        return 'home.result.prestation.PC_FAM.explication';
      }
      if (this.isPrestationRefusee && this.isConcubinAvecEnfantsPropres) {
        return {
          key: 'home.result.verifierConcubin',
          parameters: {
            prestation: Prestation.PC_FAM
          }
        };
      }
      return null;
    },

    [Prestation.PC_AVS_AI]: () => {
      if (this.isPrestationRefusee && this.isConcubin) {
        return {
          key: 'home.result.verifierConcubin',
          parameters: {
            prestation: Prestation.PC_AVS_AI
          }
        };
      }
      return null;
    }
  };

  constructor(private translateService: TranslateService) {

  }

  get isPrestationRefusee() {
    return this.type === 'refusee'
  }

  get isPrestationDejaPercue() {
    return this.type === 'dejaPercue';
  }

  get isPrestationEligible() {
    return this.type === 'eligible';
  }

  get isPrestationIndividuel() {
    return this.resultsByPrestation.prestation === Prestation.SUBSIDES ||
           this.resultsByPrestation.prestation === Prestation.BOURSES;
  }

  get isConcubinAvecEnfantsPropres(): boolean {
    const demandeurResult = this.resultsByPrestation.results.find(r => r.membre.id === 0);

    return this.isConcubin && !!demandeurResult.conjointEnfantsPropres;
  }

  get isConcubin(): boolean {
    const demandeurResult = this.resultsByPrestation.results.find(r => r.membre.id === 0);
    const demandeur: Demandeur = demandeurResult.membre as Demandeur;

    return demandeur.hasConcubin;
  }

  get informationMessage() {
    const messageEvaluator = this.exportBlockMessageEvaluators[this.resultsByPrestation.prestation];

    return messageEvaluator ? messageEvaluator() : null;
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
