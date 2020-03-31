import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Prestation } from '../../service/configuration/prestation.model';
import { EligibiliteGroup, EligibiliteRefusee } from '../../service/question/eligibilite.model';
import { QeliState } from '../../service/question/qeli-state.model';

@Component({
  selector: 'app-form-result',
  templateUrl: './form-result.component.html',
  styleUrls: ['./form-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormResultComponent {
  eligibiles: Prestation[];
  dejaPercues: Prestation[];
  refusees: EligibiliteRefusee[];

  constructor() {

  }

  @Input()
  set qeliState(state: QeliState) {
    this.dejaPercues = state.eligibilitesRefusees.filter(e => e.dejaPercue).map(e => e.eligibilite.prestation);
    this.refusees = state.eligibilitesRefusees.filter(e => !e.dejaPercue);
    this.eligibiles = [...new Set(
      state.eligibilites.filter(eligibilite =>
        !new EligibiliteGroup(state.eligibilitesRefusees.map(refus => refus.eligibilite)).includes(eligibilite)
      ).map(eligiilite => eligiilite.prestation))
    ];
  }
}
