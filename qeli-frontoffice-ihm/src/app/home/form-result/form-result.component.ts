import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-result',
  templateUrl: './form-result.component.html',
  styleUrls: ['./form-result.component.scss']
})
export class FormResultComponent {

  @Input() result: any;

  constructor() {

  }
}
