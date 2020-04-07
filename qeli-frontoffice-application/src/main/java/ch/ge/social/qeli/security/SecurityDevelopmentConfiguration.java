package ch.ge.social.qeli.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

/**
 * Configuration de la sécurité une fois l'application est deployée dans l'environment de l'état.
 */
@Configuration
@Profile("development")
@EnableWebSecurity
public class SecurityDevelopmentConfiguration extends WebSecurityConfigurerAdapter {

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http.authorizeRequests()
        .anyRequest()
        .permitAll()
        .and().headers().contentSecurityPolicy("default-src 'self' ge.ch *.etat-ge.ch demo.ge.ch 'unsafe-inline'; " +
                                               "script-src 'self' ge.ch *.etat-ge.ch demo.ge.ch 'unsafe-inline' " +
                                               "'unsafe-eval'; connect-src 'self' ge.ch; object-src 'none'; ")
        .and().frameOptions().sameOrigin()
        .and().csrf().disable();
  }
}
