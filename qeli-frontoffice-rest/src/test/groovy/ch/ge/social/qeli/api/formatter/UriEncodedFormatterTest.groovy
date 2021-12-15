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

package ch.ge.social.qeli.api.formatter

import java.nio.charset.StandardCharsets
import spock.lang.Specification

class UriEncodedFormatterTest extends Specification {

  def formatter = new UriEncodedFormatter()

  def "print devrait retourner un string codée en format URI"() {
    given:
    def decodedString = "ABab(&%=#)"

    when:
    def result = formatter.print(decodedString, Locale.FRENCH)

    then:
    URLDecoder.decode(result, StandardCharsets.UTF_8.toString()) == decodedString
  }

  def "parse devrait decoder un string en format URI"() {
    given:
    def decodedString = "ABab(&%=#)"
    def encodedString = URLEncoder.encode("ABab(&%=#)", StandardCharsets.UTF_8.toString())

    when:
    def result = formatter.parse(encodedString, Locale.FRENCH)

    then:
    result == decodedString
  }

}
