import { Injectable } from '@angular/core';
import * as Bowser from 'bowser';
import ParsedResult = Bowser.Parser.ParsedResult;

@Injectable({
  providedIn: 'root'
})
export class BowserService {
  private browser: ParsedResult;

  constructor() {
    this.browser = Bowser.parse(window.navigator.userAgent);
  }

  get mobile(): boolean {
    return this.browser.platform.type === 'mobile' ||
           this.browser.platform.type === 'tablet';
  }
}
