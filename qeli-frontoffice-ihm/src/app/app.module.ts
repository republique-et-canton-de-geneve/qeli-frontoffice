import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeFrCH from '@angular/common/locales/fr-CH';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { LayoutModule } from './layout/layout.module';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { HomeModule } from './home/home.module';
import { MatomoModule } from 'ngx-matomo';
import { MESSAGE_FORMAT_CONFIG } from 'ngx-translate-messageformat-compiler';
import {NgcCookieConsentModule, NgcCookieConsentConfig} from 'ngx-cookieconsent';
import { environment } from '../environments/environment';

const cookieConfig:NgcCookieConsentConfig = {
  cookie: {
    domain: environment.domain
  },
  palette: {
    popup: {
      background: '#fff',
      text:'#2d7a8a'
    },
    button: {
      background: '#2d7a8a',
      text: '#fff'
    }
  },
  theme: 'edgeless',
  type: 'info',

  content: {
    "message": "En naviguant sur ce site, vous acceptez l'utilisation statistique de cookies destinés à son amélioration continue.",
    "dismiss": "Accepter",
    "deny": "Refuser",
    "link": "Plus d'information",
    "href": "https://www.ge.ch/conditions-generales",
    "policy": "Cookie Policy",
    "header": "Cookies sur le site",
    "allow": "Autoriser les cookies"
  }

};
registerLocaleData(localeFrCH);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CoreModule,
    LayoutModule,
    HomeModule,
    RouterModule,
    MatomoModule,
    NgcCookieConsentModule.forRoot(cookieConfig)
  ],
  providers: [
    {provide: LOCALE_ID, useValue: "fr-CH"},
    {provide: MESSAGE_FORMAT_CONFIG, useValue: {locales: ['fr']}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
