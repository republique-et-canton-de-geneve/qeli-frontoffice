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
