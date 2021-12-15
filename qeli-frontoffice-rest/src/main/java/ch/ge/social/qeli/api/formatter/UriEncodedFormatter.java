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

package ch.ge.social.qeli.api.formatter;

import java.io.UncheckedIOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Locale;
import org.springframework.format.Formatter;

/**
 * Un formateur capable d'analyser et d'imprimer des strings codées en format URI.
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
