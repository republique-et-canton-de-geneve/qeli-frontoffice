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

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Un enum représentant les liens possibles entre le demandeur et un membre de la famille.
 */
@Getter
@AllArgsConstructor
public enum Relation {
  /**
   * L'époux ou épouse du demandeur.
   */
  EPOUX(true),
  /**
   * Le partenaire enregistré du demandeur.
   */
  PARTENAIRE_ENREGISTRE(true),
  /**
   * Le concubin du demandeur.
   */
  CONCUBIN(true),
  /**
   * Un enfant du foyer.
   */
  ENFANT(true),
  /**
   * Un colocataire du foyer.
   */
  COLOCATAIRE(false),
  /**
   * Un autre membre du foyer.
   */
  AUTRE(false);

  /**
   * S'il s'agit d'un membre de la famille ou pas.
   */
  private final boolean isMembreFamille;

}
