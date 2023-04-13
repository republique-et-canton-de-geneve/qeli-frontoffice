/*
 * qeli-frontoffice
 *
 * Copyright (C) 2019-2023 Republique et canton de Geneve
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

import com.google.common.base.CharMatcher;
import javax.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * La configuration des paramètres du frontend.
 */
@Data
@Configuration
@EnableConfigurationProperties
@ConfigurationProperties("social.tools.frontoffice")
public class ApplicationConfigurationProperties {

  @NotBlank
  private String ihmResourceLocation;

  @NotBlank
  private String ihmContextPath;

  public String getIhmResourceLocation() {
    return trimTrailingSlash(ihmResourceLocation);
  }

  public String getIhmContextPath() {
    return trimTrailingSlash(ihmContextPath);
  }

  private String trimTrailingSlash(String s) {
    return CharMatcher.is('/').trimTrailingFrom(s);
  }
}
