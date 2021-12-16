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

package ch.ge.social.qeli.editique;

import ch.ge.social.qeli.xml.edition.RapportType;
import org.springframework.stereotype.Component;

@Component
public class EditiqueClientMock implements EditiqueClient {

  @Override
  public byte[] generateDocument(RapportType rapport) {
    // TODO Ecrire juste ce qu'il y a dans rapport.getDEBUTDOCUMENT().getMETIER().getTexte1() dans un pdf
    return new byte[0];
  }


}
