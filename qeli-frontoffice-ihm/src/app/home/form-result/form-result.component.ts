import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Prestation } from '../../service/configuration/prestation.model';
import { TranslateService } from '@ngx-translate/core';
import { EligibiliteRefusee} from '../../service/question/eligibilite.model';
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
  reponses: any;

  constructor(private translateService: TranslateService) {

  }

  @Input()
  set qeliState(state: QeliState) {
    this.reponses = state.formData;
    this.dejaPercues = state.eligibilitesRefusees.filter(e => e.dejaPercue).map(e => e.eligibilite.prestation);
    this.refusees = state.eligibilitesRefusees.filter(e => !e.dejaPercue);
    this.eligibiles = Object.values(Prestation)
                            .filter(p => !this.dejaPercues.includes(p) &&
                                         !this.refusees.some(r => r.eligibilite.prestation === p));
  }
}
