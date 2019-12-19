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

  def "parse devrait decodéer un string en format URI"() {
    given:
    def decodedString = "ABab(&%=#)"
    def encodedString = URLEncoder.encode("ABab(&%=#)", StandardCharsets.UTF_8.toString())

    when:
    def result = formatter.parse(encodedString, Locale.FRENCH)

    then:
    result == decodedString
  }

}
