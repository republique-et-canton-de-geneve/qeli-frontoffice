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
    },

    [Prestation.BOURSES]: () => {
      const enfants11P = this.enfants11P;
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
    return this.isConcubin && !!this.resultatDemandeur.conjointEnfantsPropres;
  }

  get isConcubin(): boolean {
    const demandeur: Demandeur = this.resultatDemandeur.membre as Demandeur;

    return demandeur.hasConcubin;
  }

  get enfants11P() {
    return (this.resultatDemandeur.enfants11P || []).map(enfant => enfant.prenom);
  }

  get informationMessage() {
    const messageEvaluator = this.exportBlockMessageEvaluators[this.resultsByPrestation.prestation];

    return messageEvaluator ? messageEvaluator() : null;
  }

  private get resultatDemandeur() {
    return this.resultsByPrestation.results.find(r => r.membre.id === 0);
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
