import { Component, Input } from '@angular/core';
import { I18nString } from '../../core/i18n/i18nstring.model';

@Component({
  selector: 'app-help-block',
  templateUrl: './help-block.component.html',
  styleUrls: ['./help-block.component.scss']
})
export class HelpBlockComponent {
  @Input() text: I18nString;
  @Input() collapsable: boolean;
  collapsed = true;

  constructor() {
  }
}
