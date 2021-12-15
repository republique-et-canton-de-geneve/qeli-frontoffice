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

package ch.ge.social.qeli.service.api.demandeur.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;


/**
 * Un modèle représentant un membre de la famille du demandeur habitant sous le même foyer.
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class MembreFamille extends Personne {

  /**
   * La relation entre ce membre et le demandeur.
   */
  private Relation relation;
}
