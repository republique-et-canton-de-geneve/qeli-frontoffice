package ch.ge.social.qeli.api.formatter;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import org.springframework.format.AnnotationFormatterFactory;
import org.springframework.format.Parser;
import org.springframework.format.Printer;

/**
 * Une factory qui fournit le formateur pour les champs annotés avec {@link UriEncoded}.
 */
public class UriEncodedAnnotationFormatterFactory implements AnnotationFormatterFactory<UriEncoded> {
  private static final UriEncodedFormatter FORMATTER = new UriEncodedFormatter();

  @Override
  public Set<Class<?>> getFieldTypes() {
    return new HashSet<>(Arrays.asList(String.class));
  }

  @Override
  public Printer<?> getPrinter(UriEncoded annotation, Class<?> fieldType) {
    return FORMATTER;
  }

  @Override
  public Parser<?> getParser(UriEncoded annotation, Class<?> fieldType) {
    return FORMATTER;
  }
}
