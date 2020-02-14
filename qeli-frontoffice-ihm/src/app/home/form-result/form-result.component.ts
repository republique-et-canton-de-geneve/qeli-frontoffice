import { Component, Input } from '@angular/core';
import { Prestation } from '../../core/common/prestation.model';
import { FormState } from '../../core/common/form-state.model';
import { PrestationResolver } from '../../core/common/prestation-resolver';

@Component({
  selector: 'app-form-result',
  templateUrl: './form-result.component.html',
  styleUrls: ['./form-result.component.scss']
})
export class FormResultComponent {
  prestationEligible: Prestation[];
  prestationDejaPercues: Prestation[];
  prestationsRefusees: { prestation: Prestation, questionKey: string }[];
  reponses: any;

  constructor() {

  }

  @Input()
  set formState(formState: FormState) {
    this.reponses = formState.data;

    this.prestationEligible = PrestationResolver.findPrestationsEligibles(formState.prestationsRefusees);

    this.prestationsRefusees = PrestationResolver.findPrestationsRefusees(formState.prestationsRefusees);

    this.prestationDejaPercues = PrestationResolver.findPrestationsDejaPercues(formState.prestationsRefusees)
                                                   .map(prestationDejaPercue => prestationDejaPercue.prestation);
  }
}
