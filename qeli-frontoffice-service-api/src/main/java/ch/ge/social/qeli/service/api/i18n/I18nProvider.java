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
