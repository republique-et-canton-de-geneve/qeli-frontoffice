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
