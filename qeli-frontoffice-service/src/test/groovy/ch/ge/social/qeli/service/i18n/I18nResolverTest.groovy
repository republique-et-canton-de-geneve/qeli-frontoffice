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
import ch.ge.social.qeli.service.api.demandeur.dto.Personne
import ch.ge.social.qeli.service.api.i18n.I18nProvider
import ch.ge.social.qeli.service.api.i18n.dto.I18nString
import ch.ge.social.qeli.service.api.result.dto.Prestation
import ch.ge.social.qeli.service.api.result.dto.Result
import javax.annotation.Resource
import spock.lang.Specification

@ServiceTest
class I18nResolverTest extends Specification {

  @Resource
  I18nProvider i18nProvider

  def "translate devrait traduire une clé sans paramètre"() {
    given:
    def i18nResolver = getResolver()

    when:
    def translation = i18nResolver.translate("home.result.prestation.SUBSIDES.title")

    then:
    !translation.empty
    translation == "Subsides d'assurance-maladie"
  }

  def "translate devrait traduire une clé avec des paramètre"() {
    given:
    def i18nResolver = getResolver()
    def i18nKey = new I18nString(
      "home.result.prestation.SUBSIDES.eligible",
      ["who": "other", "membre": "TEST"]
    )

    when:
    def translation = i18nResolver.translate(i18nKey)

    then:
    !translation.empty
    translation == "TEST est éligible"
  }

  def "translate devrait traduire une prestation et son résultat"() {
    given:
    def i18nResolver = getResolver()
    def prestation = Prestation.SUBSIDES
    def personne = new Personne()
    personne.prenom = prenom
    personne.id = chef ? 0 : 1
    def result = new Result(personne, eligible, dejaPercue, Mock(I18nString))

    when:
    def translation = i18nResolver.translate(prestation, result)

    then:
    !translation.empty
    translation == expect

    where:
    prenom | chef  | eligible | dejaPercue | expect
    "TEST" | false | true     | false      | "TEST est éligible"
    "TEST" | true  | true     | false      | "Vous êtes éligible"
    "TEST" | false | false    | false      | "TEST n'est pas éligible"
    "TEST" | true  | false    | false      | "Vous n'êtes pas éligible"
    "TEST" | false | false    | true       | "TEST perçoit déjà cette prestation"
    "TEST" | true  | false    | true       | "Vous percevez déjà cette prestation"

  }

  def getResolver() {
    return i18nProvider.getByLocale(Locale.FRENCH)
  }
}
