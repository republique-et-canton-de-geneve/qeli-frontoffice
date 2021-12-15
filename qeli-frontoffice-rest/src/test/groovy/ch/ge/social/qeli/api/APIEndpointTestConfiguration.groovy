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

package ch.ge.social.qeli.api

import ch.ge.social.qeli.service.api.pdf.PDFCreationService
import ch.ge.social.qeli.service.api.stats.StatsService
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import spock.mock.DetachedMockFactory

/**
 * Déclarations des mock beans pour les tests unitaires.
 */
@TestConfiguration
class APIEndpointTestConfiguration {
  def detachedMockFactory = new DetachedMockFactory()

  @Bean
  PDFCreationService pdfCreationService() {
    detachedMockFactory.Mock(PDFCreationService)
  }

  @Bean
  StatsService statsService() {
    detachedMockFactory.Mock(StatsService)
  }
}
