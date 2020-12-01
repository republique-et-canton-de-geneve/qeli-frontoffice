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
    String resultAsString = result.isEligible() ? "eligible" : (result.isDejaPercue()) ? "dejaPercue" : "refusee";
    return this.translate(new I18nString(
      String.format("home.result.prestation.%s.%s", prestation.name(), resultAsString),
      ImmutableMap.<String, Object>builder()
        .put("who", result.getMembre().getId() == 0 ? "me" : "them")
        .put("membre", result.getMembre().getPrenom())
        .build()
    ));

  }
}
