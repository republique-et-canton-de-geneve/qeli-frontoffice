import { Component, Input } from '@angular/core';
import { Prestation } from '../../core/common/prestation.model';

@Component({
  selector: 'app-form-result',
  templateUrl: './form-result.component.html',
  styleUrls: ['./form-result.component.scss']
})
export class FormResultComponent {

  @Input() result: {
    prestationEligible: Prestation[],
    data: any
  };

  constructor() {

  }

  get prestationsRefusees() {
    return Object.values(Prestation).filter(prestation => !this.result.prestationEligible.includes(prestation))
  }
}
