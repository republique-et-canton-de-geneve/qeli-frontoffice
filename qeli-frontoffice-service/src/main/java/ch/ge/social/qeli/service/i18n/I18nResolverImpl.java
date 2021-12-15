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

import ch.ge.social.qeli.service.api.i18n.I18nResolver;
import ch.ge.social.qeli.service.api.i18n.dto.I18nString;
import ch.ge.social.qeli.service.api.result.dto.Prestation;
import ch.ge.social.qeli.service.api.result.dto.Result;
import com.google.common.collect.ImmutableMap;
import com.ibm.icu.text.MessageFormat;
import com.jayway.jsonpath.DocumentContext;

public class I18nResolverImpl implements I18nResolver {
  private final DocumentContext translationFileContext;

  I18nResolverImpl(DocumentContext translationFileContext) {
    this.translationFileContext = translationFileContext;
  }

  @Override
  public String translate(I18nString i18nString) {
    String pattern = this.translationFileContext.read(String.format("$.%s", i18nString.getKey()));
    if (i18nString.getParameters().size() > 0) {
      return MessageFormat.format(pattern, i18nString.getParameters());
    } else {
      return pattern;
    }
  }

  @Override
  public String translate(String key) {
    return this.translate(new I18nString(key));
  }

  @Override
  public String translate(Prestation prestation, Result result) {
    String refuseeOrDejaPercue = (result.isDejaPercue()) ? "dejaPercue" : "refusee";
    String resultAsString = result.isEligible() ? "eligible" : refuseeOrDejaPercue;

    return this.translate(new I18nString(
      String.format("home.result.prestation.%s.%s", prestation.name(), resultAsString),
      ImmutableMap.<String, Object>builder()
        .put("who", result.getMembre().getId() == 0 ? "me" : "them")
        .put("membre", result.getMembre().getPrenom())
        .build()
    ));

  }
}
