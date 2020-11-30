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
