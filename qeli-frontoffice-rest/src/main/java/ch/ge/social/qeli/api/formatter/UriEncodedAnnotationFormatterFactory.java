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
