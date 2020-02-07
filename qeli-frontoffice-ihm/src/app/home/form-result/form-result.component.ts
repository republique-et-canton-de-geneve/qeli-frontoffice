import { Component, Input } from '@angular/core';
import { Prestation } from '../../core/common/prestation.model';
import { FormState } from '../../core/dynamic-form/form-state.model';

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

    this.prestationEligible = Object.values(Prestation).filter(
      prestation => !formState.prestationsRefusees.some(
        prestationRefusee => prestationRefusee.prestation === prestation
      )
    );

    this.prestationDejaPercues = formState.prestationsRefusees.filter(
      prestationRefusee => prestationRefusee.questionKey === 'prestations'
    ).map(prestationRefusee => prestationRefusee.prestation);

    this.prestationsRefusees = formState.prestationsRefusees.filter(
      prestationRefusee => prestationRefusee.questionKey !== 'prestations'
    );
  }
}
