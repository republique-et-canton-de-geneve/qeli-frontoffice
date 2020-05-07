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
import { NgcCookieConsentModule, NgcCookieConsentConfig } from 'ngx-cookieconsent';

const cookieConfig:NgcCookieConsentConfig = {
  cookie: {
    domain: 'localhost:4200'
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
