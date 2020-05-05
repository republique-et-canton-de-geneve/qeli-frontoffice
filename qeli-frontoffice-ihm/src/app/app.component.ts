import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgcCookieConsentService } from 'ngx-cookieconsent';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private popupOpenSubscription: Subscription;
  private popupCloseSubscription: Subscription;

  constructor(private translate: TranslateService, private ccService: NgcCookieConsentService) {

  }

  ngOnInit(): void {
    this.translate.addLangs(["fr"]);
    this.translate.setDefaultLang("fr");
    this.translate.use("fr");

    this.popupOpenSubscription = this.ccService.popupOpen$.subscribe(
      () => {
        console.log('open popup');
      });

    this.popupCloseSubscription = this.ccService.popupClose$.subscribe(
      () => {
        console.log('close popup');

      });
  }
}
