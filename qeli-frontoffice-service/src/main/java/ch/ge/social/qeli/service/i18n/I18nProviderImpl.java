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

package ch.ge.social.qeli.service.i18n;

import ch.ge.social.qeli.service.api.i18n.I18nProvider;
import ch.ge.social.qeli.service.api.i18n.I18nResolver;
import ch.ge.social.qeli.service.api.i18n.LanguageNotSupportedException;
import com.jayway.jsonpath.JsonPath;
import java.io.IOException;
import java.util.Locale;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

@Service
public class I18nProviderImpl implements I18nProvider {
  private final ResourceLoader resourceLoader;

  @Autowired
  public I18nProviderImpl(ResourceLoader resourceLoader) {
    this.resourceLoader = resourceLoader;
  }

  @Override
  public I18nResolver getByLocale(Locale locale) {
    Resource resource = this.resourceLoader.getResource(String.format("classpath:i18n/%s.json", locale.getLanguage()));
    try {
      return new I18nResolverImpl(JsonPath.parse(resource.getURL()));
    } catch (IOException e) {
      throw new LanguageNotSupportedException(
        String.format("La langue : %s n'est pas suporté", locale.getLanguage()), e
      );
    }
  }
}
