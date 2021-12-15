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

/**
 * Un enum représentant toutes les prestations connues par le questionnaire d'éligibilité.
 */
export enum Prestation {
  /**
   * Subsides d'assurance-maladie. Tous les membres du foyer peuvent bénéficier individuellement de cette prestation.
   */
  SUBSIDES            = 'SUBSIDES',
  /**
   * Avances de pensions alimentaires. Prestation valable seulement pour le demandeur.
   */
  AVANCES             = 'AVANCES',
  /**
   * Allocation logement. Prestation valable seulement pour le demandeur.
   */
  ALLOCATION_LOGEMENT = 'ALLOCATION_LOGEMENT',
  /**
   * Subvention habitation mixte. L'éligbilité de cette prestation n'est pas calculée par le questionnaire.
   */
  SUBVENTION_HM       = 'SUBVENTION_HM',
  /**
   * Prestations complémentaires AVS/AI. Tous les membres du foyer peuvent bénéficier individuellement de cette
   * prestation, l'éligibilité des concubins·es n'est pas calculée.
   */
  PC_AVS_AI           = 'PC_AVS_AI',
  /**
   * Bourses d'études. Tous les membres du foyer peuvent bénéficier individuellement de cette prestation.
   */
  BOURSES             = 'BOURSES',
  /**
   * Prestations complémentaires familiales. Prestation valable pour tout le foyer.
   */
  PC_FAM              = 'PC_FAM',
  /**
   * Aide Sociale. Prestation valable seulement pour le demandeur.
   */
  AIDE_SOCIALE        = 'AIDE_SOCIALE'
}
