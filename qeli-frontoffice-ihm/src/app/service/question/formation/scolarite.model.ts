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

import { QuestionOption } from '../../../dynamic-question/model/question.model';

export enum Scolarite {
  SCOLARITE_OBLIGATOIRE_1P_A_10P = 'SCOLARITE_OBLIGATOIRE_1P_A_10P',
  SCOLARITE_OBLIGATOIRE_11P      = 'SCOLARITE_OBLIGATOIRE_11P',
  COLLEGE_APRENTISSAGE           = 'COLLEGE_APRENTISSAGE',
  CLASSE_PREPARATOIRE            = 'CLASSE_PREPARATOIRE',
  ECOLE_SUPERIEUR                = 'ECOLE_SUPERIEUR',
  BREVET                         = 'BREVET',
  UNIVERSITE_MASTER              = 'UNIVERSITE_MASTER',
  UNIVERSITE_DOCTORAT            = 'UNIVERSITE_DOCTORAT',
  FORMATION_CONTINUE_CERTIFIANTE = 'FORMATION_CONTINUE_CERTIFIANTE',
  FORMATION_CONTINUE_COURTE      = 'FORMATION_CONTINUE_COURTE',
  FORMATION_CONTINUE_AUTRE       = 'FORMATION_CONTINUE_AUTRE',
  AUTRE_FORMATION                = 'AUTRE_FORMATION'
}

/**
 * Crée une option pour un type de scolarité.
 *
 * @param typeScolarite le type de scolarité.
 */
export function typeScolariteToOption(typeScolarite: Scolarite): QuestionOption<string> {
  return {
    value: typeScolarite,
    label: {
      key: `common.scolarite.${typeScolarite}`
    }
  };
}

/**
 * Liste toutes les options des types de scolarités.
 */
export function typeScolariteOptions(): QuestionOption<string>[] {
  return Object.values(Scolarite).map(typeScolariteToOption);
}
