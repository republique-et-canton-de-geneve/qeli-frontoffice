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

package ch.ge.social.qeli.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

/**
 * Configuration de la sécurité en mode dévelopement.
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
