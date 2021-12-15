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

package ch.ge.social.qeli.api;

import ch.ge.social.qeli.api.formatter.UriEncodedAnnotationFormatterFactory;
import ch.ge.social.qeli.api.interceptor.RegisterCaptchaHandlerInterceptor;
import com.captcha.botdetect.web.servlet.SimpleCaptchaServlet;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Classe de configuration Spring pour l'API REST de l'application.
 */
@Configuration
@ComponentScan("ch.ge.social.qeli.api")
@EnableAutoConfiguration
public class APIEndpointConfiguration implements WebMvcConfigurer {
  @Override
  public void addInterceptors(InterceptorRegistry registry) {
    registry.addInterceptor(new RegisterCaptchaHandlerInterceptor());
  }

  @Override
  public void addFormatters(FormatterRegistry registry) {
    registry.addFormatterForFieldAnnotation(new UriEncodedAnnotationFormatterFactory());
  }

  @Bean
  ServletRegistrationBean captchaServletRegistration() {
    ServletRegistrationBean<SimpleCaptchaServlet> srb = new ServletRegistrationBean<>();
    srb.setServlet(new SimpleCaptchaServlet());
    srb.addUrlMappings("/api/captcha", "/api/captcha-endpoint");
    return srb;
  }
}
