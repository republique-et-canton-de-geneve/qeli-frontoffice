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

import java.util.List;
import java.util.stream.Collectors;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Un modèle représentant la personne qui fait une demande auprès du questionnaire d'éligibilité.
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class Demandeur extends Personne {
  /**
   * L'état civil du demandeur.
   */
  private EtatCivil etatCivil;

  /**
   * Les membres qui composent le foyer du demandeur.
   */
  private List<MembreFamille> membresFoyer;

  /**
   * Retrouve tous les membres du foyer du demandeur qui font parti de la famille.
   *
   * @return tout les membres de la famille.
   *
   * @see Relation#isMembreFamille()
   */
  public List<MembreFamille> fetchMembresFamille() {
    return this.membresFoyer.stream()
                            .filter(membre -> membre.getRelation().isMembreFamille())
                            .collect(Collectors.toList());
  }
}
