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

package ch.ge.social.qeli;

import ch.ge.social.qeli.api.APIEndpointConfiguration;
import ch.ge.social.qeli.editique.EditiqueConfiguration;
import ch.ge.social.qeli.security.SecurityConfiguration;
import ch.ge.social.qeli.security.SecurityDevelopmentConfiguration;
import ch.ge.social.qeli.service.ServiceConfiguration;
import java.util.regex.Pattern;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.core.convert.ConversionService;
import org.springframework.format.support.DefaultFormattingConversionService;

/**
 * Classe de configuration Spring agrégeant toutes les configurations des différents modules du front office.
 */
@Configuration
@Import(
  {
    FrontofficeIHMConfiguration.class,
    EditiqueConfiguration.class,
    ServiceConfiguration.class,
    APIEndpointConfiguration.class,
    SecurityConfiguration.class,
    SecurityDevelopmentConfiguration.class
  }
)
public class FrontofficeConfiguration {

  @Bean
  public ConversionService conversionService() {
    DefaultFormattingConversionService conversionService = new DefaultFormattingConversionService();
    conversionService.addConverter(String.class, Pattern.class, Pattern::compile);
    return conversionService;
  }

}
