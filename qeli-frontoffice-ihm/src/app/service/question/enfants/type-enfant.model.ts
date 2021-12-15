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
import { Personne } from '../../configuration/demandeur.model';

export enum TypeEnfant {
  LES_DEUX     = "LES_DEUX",
  MOI          = 'MOI',
  AUTRE_PARENT = "AUTRE_PARENT",
  AUTRES       = "AUTRES"
}

const OPTIONS_SANS_AUTRES_PARENTS = [TypeEnfant.MOI, TypeEnfant.AUTRES];

function typeEnfantToOption(typeEnfant: TypeEnfant, autreParent: Personne): QuestionOption<string> {
  return {
    value: typeEnfant,
    label: {
      key: `common.typeEnfant.${typeEnfant}`,
      parameters: typeEnfant === TypeEnfant.AUTRE_PARENT ? {prenomAutreParent: autreParent.prenom} : {}
    }
  };
}

export function typeEnfantAsOptions(autreParent: Personne): QuestionOption<string>[] {
  const options: TypeEnfant[] = autreParent ? Object.values(TypeEnfant) : OPTIONS_SANS_AUTRES_PARENTS;
  return options.map(typeEnfant => typeEnfantToOption(typeEnfant, autreParent));
}
