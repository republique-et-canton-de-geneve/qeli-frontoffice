package ch.ge.social.qeli.api.controller.configuration

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get

import ch.ge.social.qeli.api.APIEndpointTest
import groovy.json.JsonSlurper
import javax.annotation.Resource
import org.springframework.test.web.servlet.MockMvc
import spock.lang.Specification

@APIEndpointTest
class QeliConfigurationPropertiesControllerTest extends Specification {

  @Resource
  MockMvc mvc

  JsonSlurper jsonSlurper = new JsonSlurper()

  def "getQeliConfigurationProperties devrait retourner les paramètres de configuration du front office de l'application"() {
    when:
    def response = mvc.perform(get("/api/configuration")).andReturn().response
    def content = jsonSlurper.parseText(response.getContentAsString()) as QeliConfigurationProperties

    then:
    response.status == 200

    and:
    content != null
    content.minYearsFromNow == 130
    content.maxEnfantsACharge == 20
    content.minTauxActiviteSeul == 40
    content.minTauxActiviteAvecConjoint == 90
    content.limiteFortune == 4000
    content.limiteFortunePerEnfant == 2000
    content.limiteFortuneConjoint == 4000
    content.maxLimiteFortune == 10000
    content.taxationAfcYearsFromNow == 2
    content.heuresTravailParSemaine == 40
    content.matomo != null
    content.matomo.server == "***REMOVED***"
    content.matomo.siteId == 15
    content.api.pdf.enabled
    content.api.stats.enabled
  }
}
