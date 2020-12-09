import { Component, Input } from '@angular/core';
import { I18nString } from '../../core/i18n/i18nstring.model';

@Component({
  selector: 'app-help-block',
  templateUrl: './help-block.component.html',
  styleUrls: ['./help-block.component.scss']
})
export class HelpBlockComponent {
  @Input() collapsable: boolean;
  i18n: I18nString;
  collapsed = true;

  constructor() {
  }

  @Input()
  set text(text: I18nString) {
    this.collapsed = true;
    this.i18n = text;
  }
}
