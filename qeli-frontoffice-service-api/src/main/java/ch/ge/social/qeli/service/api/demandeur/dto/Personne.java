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

import java.time.LocalDate;
import lombok.Data;

/**
 * Un modèle représentant un membre du foyer, sois le demandeur sois un autre membre..
 */
@Data
public class Personne {
  /**
   * Un identifiant unique entre les membres du foyer.
   */
  private Integer id;

  /**
   * Le prénom. Ce prénom apparaît sur l'écran pour identifier la personne.
   */
  private String prenom;

  /**
   * La data de naissance.
   */
  private LocalDate dateNaissance;
}
