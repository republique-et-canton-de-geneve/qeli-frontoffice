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

package ch.ge.social.qeli

import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.DirtiesContext
import org.springframework.test.context.ActiveProfiles
import spock.lang.Specification

/**
 * Vérifie que l'application démarre avec le profil development activé.
 *
 * <p>
 *   L'annotation {@link DirtiesContext} est utilisée pour démonter le context Spring à la fin
 *   de l'exécution des tests.
 * </p>
 */
@SpringBootTest
@ActiveProfiles("development")
@DirtiesContext
class FrontofficeApplicationTest extends Specification {

  def "Le context démarre avec le profile development activé"() {
    expect: "Quand l'éxecution arrive ici le context spring a démarré"
    true
  }

}
