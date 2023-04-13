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

import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatomoInitializerService } from '@ngx-matomo/tracker';
import { QeliConfigurationService } from './service/configuration/qeli-configuration.service';
import { Subscription } from 'rxjs';
import { NgcCookieConsentService, NgcInitializeEvent, NgcStatusChangeEvent } from 'ngx-cookieconsent';
import { CookieService } from 'ngx-cookie-service';
import {
  COOKIE_AGREED, COOKIE_BANNER, COOKIE_BANNER_STATUS_DISMISS, COOKIE_EXPIRY_DAYS, CookieAgreedStatus, CookieUtils
} from './service/cookie-status.utils';
import { QeliConfiguration } from './service/configuration/qeli-configuration.model';
import { TrackingService } from './service/tracking/tracking.service';

const LANGUAGE = 'fr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  _isLoading = false;
  private _cookieInitialized$: Subscription;
  private _cookieStatusChange$: Subscription;

  constructor(private _translate: TranslateService,
              private _configurationService: QeliConfigurationService,
              private _ccService: NgcCookieConsentService,
              private _cookieService: CookieService,
              private _trackingService: TrackingService,
              private _matomoInitializer: MatomoInitializerService) {
  }

  ngOnDestroy() {
    this._cookieInitialized$.unsubscribe();
    this._cookieStatusChange$.unsubscribe();
  }

  ngOnInit(): void {
    this._translate.addLangs([LANGUAGE]);
    this._translate.setDefaultLang(LANGUAGE);
    this._translate.use(LANGUAGE);

    this._trackingService.requireConsent();
    this.subscribeToCookieConsent();
    this._configurationService.configuration.subscribe(config => {
      this._initCookie(config);
      this._initMatomo(config);

      if (this._cookieService.get(COOKIE_AGREED) === CookieAgreedStatus.ACCEPTED) {
        this._trackingService.setConsentGiven();
      }
    });
  }

  subscribeToCookieConsent() {
    this._cookieInitialized$ = this._ccService.initialize$.subscribe(
      (event: NgcInitializeEvent) => {
        // init event : if cookie-agreed is not set but cookie-banner is, delete the cookie and reset the banner :
        if (!CookieUtils.isCookieAgreedSet(this._cookieService) &&
            event.status === COOKIE_BANNER_STATUS_DISMISS) {
          this._cookieService.delete(COOKIE_BANNER, '/', CookieUtils.domain);
          this._ccService.getConfig().enabled = true;
          this._ccService.init(this._ccService.getConfig());
        }
      });

    this._cookieStatusChange$ = this._ccService.statusChange$.subscribe(
      (event: NgcStatusChangeEvent) => {
        // status change event : if the banner is dismissed, then set the global cookie as accepted and consent given :
        if (event.status === COOKIE_BANNER_STATUS_DISMISS && !this._cookieService.get(COOKIE_AGREED)) {
          this._cookieService.set(COOKIE_AGREED, CookieAgreedStatus.ACCEPTED,
            {expires: COOKIE_EXPIRY_DAYS, path: '/', domain: CookieUtils.domain});
          this._trackingService.setConsentGiven();
        }
      });
  }

  private _initCookie(config: QeliConfiguration) {
    this._translate.get([
      'cookie.message', 'cookie.dismiss', 'cookie.link', 'cookie.href'
    ]).subscribe(data => {
      const cookieDomain = CookieUtils.domain;
      this._ccService.getConfig().content = this._ccService.getConfig().content || {};

      // Override default messages with the translated ones
      this._ccService.getConfig().content.message = data['cookie.message'];
      this._ccService.getConfig().content.dismiss = data['cookie.dismiss'];
      this._ccService.getConfig().content.link = data['cookie.link'];
      this._ccService.getConfig().content.href = data['cookie.href'];
      this._ccService.getConfig().cookie.name = COOKIE_BANNER;
      this._ccService.getConfig().cookie.domain = cookieDomain;

      // Banner enabled by configuration, and if cookie-agreed is not set :
      this._ccService.getConfig().enabled = config?.cookieBannerEnabled && !this._cookieService.get(COOKIE_AGREED);
      this._ccService.destroy(); // remove previous cookie bar (with default messages)
      this._ccService.init(this._ccService.getConfig()); // update config with translated messages
    });
  }

  private _initMatomo(config: QeliConfiguration) {
    const matomo = config?.matomo;
    if (matomo?.enabled) {
      this._matomoInitializer.initializeTracker({
        siteId: matomo.siteId,
        trackerUrl: matomo.server
      });
    }
  }
}
