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

package ch.ge.social.qeli.service.api.result.dto;

import java.util.List;
import lombok.Data;

/**
 * Un objet qui permet de mettre en relation une prestation avec plusieurs résultats (normalement, un pour chaque
 * membre de la famille du demandeur, et un pour le demandeur).
 */
@Data
public class ResultByPrestation {
  private Prestation   prestation;
  private List<Result> results;
}
