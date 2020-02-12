import { Component, Input } from '@angular/core';
import { Prestation } from '../../core/common/prestation.model';
import { FormState } from '../../core/dynamic-form/form-state.model';
import PrestationsUtils from '../../core/common/prestations-utils';

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

    this.prestationEligible = PrestationsUtils.getPrestationsEligibles(formState.prestationsRefusees);

    this.prestationsRefusees = PrestationsUtils.getPrestationsRefusees(formState.prestationsRefusees);

    this.prestationDejaPercues = PrestationsUtils.getPrestationsDejaPercues(formState.prestationsRefusees)
                                                 .map(prestationDejaPercue => prestationDejaPercue.prestation);
  }
}
