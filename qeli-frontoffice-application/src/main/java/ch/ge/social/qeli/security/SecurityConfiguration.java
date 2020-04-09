package ch.ge.social.qeli.security;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;

/**
 * Configuration de la sécurité une fois que l'application est deployée dans l'environment de l'État.
 */
@Configuration
@Profile("!development")
@EnableWebSecurity
@ComponentScan("ch.ge.social.qeli.security")
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http.authorizeRequests()
        .anyRequest()
        .permitAll()
        .and().headers().contentSecurityPolicy("default-src 'self' ge.ch *.etat-ge.ch demo.ge.ch 'unsafe-inline'; " +
                                               "script-src 'self' ge.ch *.etat-ge.ch demo.ge.ch 'unsafe-inline' " +
                                               "'unsafe-eval'; connect-src 'self' ge.ch; object-src 'none'; ")
        .and().referrerPolicy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN)
        .and().frameOptions().sameOrigin()
        .and().csrf().csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());
  }
}
