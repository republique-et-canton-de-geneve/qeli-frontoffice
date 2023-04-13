/*
 * qeli-frontoffice
 *
 * Copyright (C) 2019-2021 Republique et canton de Geneve
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
import { MESSAGE_FORMAT_CONFIG } from 'ngx-translate-messageformat-compiler';
import { NgcCookieConsentConfig, NgcCookieConsentModule } from 'ngx-cookieconsent';
import { CookieService } from 'ngx-cookie-service';
import { COOKIE_EXPIRY_DAYS } from './service/cookie-status.utils';
import { MatomoConsentMode, MatomoInitializationMode, NgxMatomoTrackerModule } from '@ngx-matomo/tracker';
import { NgxMatomoRouterModule } from '@ngx-matomo/router';

const cookieConfig: NgcCookieConsentConfig = {
  enabled: false,
  cookie: {
    domain: 'localhost:4200',
    expiryDays: COOKIE_EXPIRY_DAYS
  },
  palette: {
    popup: {
      background: '#EDEDED',
      text: '#337ab7'
    },
    button: {
      background: '#337ab7',
      text: '#fff'
    }
  },
  theme: 'classic',
  type: 'info'
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
    NgxMatomoTrackerModule.forRoot({
      mode: MatomoInitializationMode.AUTO_DEFERRED,
      requireConsent: MatomoConsentMode.COOKIE
    }),
    NgxMatomoRouterModule,
    NgcCookieConsentModule.forRoot(cookieConfig)
  ],
  providers: [
    {provide: LOCALE_ID, useValue: "fr-CH"},
    {provide: MESSAGE_FORMAT_CONFIG, useValue: {locales: ['fr']}},
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
