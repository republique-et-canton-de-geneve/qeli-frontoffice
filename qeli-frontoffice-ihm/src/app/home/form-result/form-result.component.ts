import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Prestation } from '../../core/common/prestation.model';
import { FormState, Refus } from '../../core/common/form-state.model';
import { PrestationResolver } from '../../core/common/prestation-resolver';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-form-result',
  templateUrl: './form-result.component.html',
  styleUrls: ['./form-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormResultComponent {
  prestationEligible: Prestation[];
  prestationDejaPercues: Prestation[];
  prestationsRefusees: Refus[];
  reponses: any;

  constructor(private translateService: TranslateService) {

  }

  @Input()
  set formState(formState: FormState) {
    this.reponses = formState.data;
    this.prestationEligible = PrestationResolver.findPrestationsEligibles(formState.prestationsRefusees);
    this.prestationsRefusees = PrestationResolver.findPrestationsRefusees(formState.prestationsRefusees, formState.data);
    this.prestationDejaPercues = PrestationResolver.findPrestationsDejaPercues(formState.data);
  }

  toMotifRefus(refus: Refus) {
    return refus.questionKeys.map(
      key => this.translateService.instant(`question.${key}.motifRefus.${refus.prestation}`)
    ).join('<br>');
  }
}
