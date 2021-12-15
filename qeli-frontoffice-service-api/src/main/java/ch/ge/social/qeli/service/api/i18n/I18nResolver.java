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

package ch.ge.social.qeli.service.api.i18n;

import ch.ge.social.qeli.service.api.i18n.dto.I18nString;
import ch.ge.social.qeli.service.api.result.dto.Prestation;
import ch.ge.social.qeli.service.api.result.dto.Result;

/**
 * Un service permettant de résoudre la traduction un objet de type {@link I18nString}.
 */
public interface I18nResolver {
  /**
   * Résout la traduction d'un objet de type {@link I18nString}.
   *
   * @param i18nString le string à traduire.
   *
   * @return la traduction.
   */
  String translate(I18nString i18nString);

  /**
   * Résout la traduction d'une clé i18n, équivalent à : {@code i18nService.translate(new I18nString(key))}.
   *
   * @param key la clé à traduire.
   *
   * @return la traduction.
   */
  String translate(String key);

  /**
   * Résout la traduction d'un résultat et sa prestation.
   *
   * @param prestation la prestation.
   * @param result     le résultat.
   *
   * @return le résultat traduit.
   */
  String translate(Prestation prestation, Result result);
}
