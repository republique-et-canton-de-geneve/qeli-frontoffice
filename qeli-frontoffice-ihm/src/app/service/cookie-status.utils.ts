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

/**
 * Nom du cookie global.
 */
export const COOKIE_AGREED = 'cookie-agreed';

/**
 * Nombre de jour de validité des cookies.
 */
export const COOKIE_EXPIRY_DAYS = 100;

/**
 * Enum listant les valeurs du cookie d'acceptation.
 */
export enum CookieAgreedStatus {
  REFUSED  = '0',
  ACCEPTED = '2'
}

/**
 * Nom du cookie de la bannière.
 */
export const COOKIE_BANNER = 'cookie-banner';

/**
 * Valeur du cookie de la bannière lorsque celle-ci est fermée.
 */
export const COOKIE_BANNER_STATUS_DISMISS = 'dismiss'

export class CookieStatusUtils {

  /**
   * Définit le nom de domaine du cookie au format ".domain.ch".
   *
   * @param hostname
   */
  static generateCookieDomain(hostname: string): string {
    return hostname.substring(hostname.lastIndexOf(".", hostname.length - 4), hostname.length);
  }

  /**
   * Si cookie agreed est défini
   *
   * @param cookieAgreed
   * @return boolean
   */
  static isCookieAgreedSet(cookieAgreed: string): boolean {
    return (cookieAgreed === CookieAgreedStatus.ACCEPTED || cookieAgreed === CookieAgreedStatus.REFUSED)
  }
}
