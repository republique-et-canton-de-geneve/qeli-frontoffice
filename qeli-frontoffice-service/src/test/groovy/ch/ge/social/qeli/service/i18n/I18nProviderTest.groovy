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

package ch.ge.social.qeli.service.i18n


import ch.ge.social.qeli.service.ServiceTest
import ch.ge.social.qeli.service.api.i18n.I18nProvider
import ch.ge.social.qeli.service.api.i18n.LanguageNotSupportedException
import javax.annotation.Resource
import spock.lang.Specification

@ServiceTest
class I18nProviderTest extends Specification {

  @Resource
  I18nProvider i18nProvider

  def "getByLocale devrait retourner une instance de I18nResolver valide"() {
    when:
    def i18nResolver = i18nProvider.getByLocale(Locale.FRENCH)

    then:
    !i18nResolver.translate("home.result.prestation.SUBSIDES.title").empty
  }

  def "getByLocale devrait retourner un erreur si le locale n'existe pas"() {
    when:
    i18nProvider.getByLocale(Locale.ENGLISH)

    then:
    thrown(LanguageNotSupportedException)
  }
}
