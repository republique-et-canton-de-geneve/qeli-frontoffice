import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Prestation } from '../../dynamic-form/model/prestation.model';
import { FormState, Refus } from '../../dynamic-form/model/form-state.model';
import { PrestationResolver } from '../../dynamic-form/model/prestation-resolver';
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
