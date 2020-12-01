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
