import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Prestation } from '../../../service/configuration/prestation.model';
import { TranslateService } from '@ngx-translate/core';
import { Result, ResultsByPrestation } from './result.model';
import { Demandeur, MembreFamille, Relation } from '../../../service/configuration/demandeur.model';

@Component({
  selector: 'result-block',
  templateUrl: './result-block.component.html',
  styleUrls: ['./result-block.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultBlockComponent {
  @Input() resultsByPrestation: ResultsByPrestation;
  @Input() type: 'eligible' | 'refusee' | 'dejaPercue';


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
    const me: Demandeur = demandeurResult.membre as Demandeur;
    const concubin: MembreFamille = (me.membresFamille || []).find(m => m.relation === Relation.CONCUBIN);

    return concubin && !!demandeurResult.conjointEnfantsPropres;
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
