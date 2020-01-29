import { Component, Input } from '@angular/core';

@Component({
  selector: 'result-block',
  templateUrl: './result-block.component.html',
  styleUrls: ['./result-block.component.scss']
})
export class ResultBlockComponent {
  @Input() title: string;
  @Input() subtitle: string;
  @Input() type: 'warning' | 'success' | 'info';
  showDetails = false;

  get danger() {
    return this.type === 'warning'
  }

  get info() {
    return this.type === 'info';
  }

  get success() {
    return this.type === 'success';
  }
}
