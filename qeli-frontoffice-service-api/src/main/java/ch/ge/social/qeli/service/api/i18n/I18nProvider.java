package ch.ge.social.qeli.service.api.i18n;

import java.util.Locale;

public interface I18nProvider {
  /**
   * Crée un nouveau {@link I18nResolver} pour la locale donnée.
   *
   * @param locale le locale.
   *
   * @return le {@link I18nResolver}.
   *
   * @throws LanguageNotSupportedException quand la langue n'est pas supportée.
   */
  I18nResolver getByLocale(Locale locale);
}
