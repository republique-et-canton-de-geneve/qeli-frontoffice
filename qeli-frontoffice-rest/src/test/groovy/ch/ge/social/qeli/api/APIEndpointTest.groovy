package ch.ge.social.qeli.api

import java.lang.annotation.Documented
import java.lang.annotation.ElementType
import java.lang.annotation.Inherited
import java.lang.annotation.Retention
import java.lang.annotation.RetentionPolicy
import java.lang.annotation.Target
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.test.context.ContextConfiguration

/**
 * Une meta-annotation Spring pour initializer les tests des endpoint REST de l'API de gestion.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@WebMvcTest(properties = "spring.main.allow-bean-definition-overriding=true")
@ContextConfiguration(classes = [
  APIEndpointConfiguration,
  APIEndpointTestConfiguration,
  APIEndpointSecuritySecurityConfiguration
])
@interface APIEndpointTest {

}
