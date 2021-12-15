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

import com.google.common.base.CharMatcher;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

/**
 * Classe de configuration Spring pour mapper l'IHM Angular.
 */
@Configuration
public class FrontofficeIHMConfiguration implements WebMvcConfigurer {
  private final ApplicationContext applicationContext;
  private final String             ihmResourceLocation;
  private final String             ihmContextPath;

  @Autowired
  public FrontofficeIHMConfiguration(
    ApplicationContext applicationContext,
    @Value("${social.tools.frontoffice.ihm-resource-location}") String ihmResourceLocation,
    @Value("${social.tools.frontoffice.ihm-context-path}") String ihmContextPath) {
    this.applicationContext = applicationContext;
    this.ihmResourceLocation = CharMatcher.is('/').trimTrailingFrom(ihmResourceLocation);
    this.ihmContextPath = CharMatcher.is('/').trimTrailingFrom(ihmContextPath);
  }

  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    registry.addResourceHandler(ihmContextPath + "/**")
            .addResourceLocations(ihmResourceLocation + "/")
            .setCachePeriod(3600)
            .resourceChain(true)
            .addResolver(new PathResourceResolver() {
              @Override
              protected Resource getResource(String resourcePath, Resource location) throws IOException {
                Resource requestedResource = location.createRelative(resourcePath);
                return requestedResource.exists() && requestedResource.isReadable() ? requestedResource :
                       applicationContext.getResource(ihmResourceLocation + "/index.html");
              }
            });
  }

  @Override
  public void addViewControllers(ViewControllerRegistry registry) {
    registry.addViewController(ihmContextPath).setViewName("forward:/" + ihmContextPath + "/");
    registry.addViewController(ihmContextPath + "/").setViewName("forward:/" + ihmContextPath + "/index.html");
  }
}
