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

package ch.ge.social.qeli.service.pdf;

import ch.ge.social.qeli.service.api.i18n.I18nProvider;
import ch.ge.social.qeli.service.api.result.dto.FormResult;
import java.util.Locale;
import org.apache.velocity.VelocityContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
class PDFRecapitulatifContextBuilder {

  private final I18nProvider i18nProvider;

  @Autowired
  public PDFRecapitulatifContextBuilder(I18nProvider i18nProvider) {
    this.i18nProvider = i18nProvider;
  }

  VelocityContext createContext(FormResult formResult) {
    VelocityContext context = new VelocityContext();
    context.put("formResult", formResult);
    context.put("i18nResolver", i18nProvider.getByLocale(Locale.FRENCH));
    return context;
  }
}
