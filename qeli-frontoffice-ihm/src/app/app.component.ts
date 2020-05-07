import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgcCookieConsentService } from 'ngx-cookieconsent';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private translate: TranslateService, private ccService: NgcCookieConsentService, private location: Location) {

  }

  ngOnInit(): void {
    this.translate.addLangs(["fr"]);
    this.translate.setDefaultLang("fr");
    this.translate.use("fr");

    this.translate
        .get(['common.cookie.header', 'common.cookie.message', 'common.cookie.dismiss', 'common.cookie.allow', 'common.cookie.deny', 'common.cookie.link', 'common.cookie.policy'])
        .subscribe(data => {

          this.ccService.getConfig().content = this.ccService.getConfig().content || {} ;
          // Override default messages with the translated ones
          this.ccService.getConfig().content.header = data['common.cookie.header'];
          this.ccService.getConfig().content.message = data['common.cookie.message'];
          this.ccService.getConfig().content.dismiss = data['common.cookie.dismiss'];
          this.ccService.getConfig().content.allow = data['common.cookie.allow'];
          this.ccService.getConfig().content.deny = data['common.cookie.deny'];
          this.ccService.getConfig().content.link = data['common.cookie.link'];
          this.ccService.getConfig().content.policy = data['common.cookie.policy'];
          this.ccService.getConfig().content.href = data['common.cookie.href'];
          this.ccService.getConfig().cookie.domain = this.location.pathname;

          this.ccService.destroy(); // remove previous cookie bar (with default messages)
          this.ccService.init(this.ccService.getConfig()); // update config with translated messages
        });

  }
}
