import { Component, Input } from '@angular/core';
import { Prestation } from '../../core/common/prestation.model';
import { FormState } from '../../core/dynamic-form/form-state.model';

@Component({
  selector: 'app-form-result',
  templateUrl: './form-result.component.html',
  styleUrls: ['./form-result.component.scss']
})
export class FormResultComponent {
  formResult: FormState;
  prestationEligible: Prestation[];
  prestationDejaPercues: Prestation[];
  prestationsRefusees: { prestation: Prestation, questionKey: string }[];

  constructor() {

  }

  @Input()
  set result(result: FormState) {
    this.formResult = result;

    this.prestationEligible = Object.values(Prestation).filter(
      prestation => !result.prestationsRefusees.some(
        prestationRefusee => prestationRefusee.prestation === prestation
      )
    );

    this.prestationDejaPercues = result.prestationsRefusees.filter(
      prestationRefusee => prestationRefusee.questionKey === 'prestations'
    ).map(prestationRefusee => prestationRefusee.prestation);

    this.prestationsRefusees = result.prestationsRefusees.filter(
      prestationRefusee => prestationRefusee.questionKey !== 'prestations'
    );
  }
}
