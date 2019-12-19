package ch.ge.social.qeli.api.formatter;

import java.io.UncheckedIOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Locale;
import org.springframework.format.Formatter;

/**
 * Un formateur capable d'analyser et d'imprimer des string codées en format URI.
 */
public class UriEncodedFormatter implements Formatter<String> {

  @Override
  public String parse(String text, Locale locale) {
    try {
      return URLDecoder.decode(text, StandardCharsets.UTF_8.toString());
    } catch (UnsupportedEncodingException e) {
      throw new UncheckedIOException(e);
    }
  }

  @Override
  public String print(String text, Locale locale) {
    try {
      return URLEncoder.encode(text, StandardCharsets.UTF_8.toString());
    } catch (UnsupportedEncodingException e) {
      throw new UncheckedIOException(e);
    }
  }
}
