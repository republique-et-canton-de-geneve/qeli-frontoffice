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

import { Personne } from '../../configuration/demandeur.model';
import { QuestionOption } from '../../../dynamic-question/model/question.model';
import { CheckboxGroup } from '../../../dynamic-question/checkbox-group-question/checkbox-group-question.model';

export enum TypeRevenus {
  EMPLOI        = 'EMPLOI',
  INDEPENDANT   = 'INDEPENDANT',
  CHOMAGE       = 'CHOMAGE',
  AVS_RETRAITE  = 'AVS_RETRAITE',
  AVS_VEUF      = 'AVS_VEUF',
  AVS_ENFANT    = 'AVS_ENFANT',
  AI_INVALIDITE = 'AI_INVALIDITE',
  AI_ENFANT     = 'AI_ENFANT',
  APG           = 'APG'
}

export const TYPE_REVENUS_AVS = [TypeRevenus.AVS_ENFANT, TypeRevenus.AVS_RETRAITE, TypeRevenus.AVS_VEUF];
export const TYPE_REVENUS_AI = [TypeRevenus.AI_ENFANT, TypeRevenus.AI_INVALIDITE];

const HAS_HELP = [TypeRevenus.APG, TypeRevenus.CHOMAGE];

export function isTypeRevenusAVS(typeRevenus: TypeRevenus | string) {
  return TYPE_REVENUS_AVS.some(revenus => typeRevenus === revenus);
}

export function isTypeRevenusAI(typeRevenus: TypeRevenus | string) {
  return TYPE_REVENUS_AI.some(revenus => typeRevenus === revenus);
}

export function typeRevenusToOption(typeRevenus: TypeRevenus, membre: Personne): QuestionOption<string> {
  const translateParams = {who: membre.id === 0 ? 'me' : 'them', membre: membre.prenom};

  if (HAS_HELP.includes(typeRevenus)) {
    return {
      value: typeRevenus,
      label: {
        key: `common.typeRevenus.${typeRevenus}.label`,
        parameters: translateParams
      },
      help: {
        key: `common.typeRevenus.${typeRevenus}.help`,
        parameters: translateParams
      }
    };
  } else {
    return {
      value: typeRevenus,
      label: {
        key: `common.typeRevenus.${typeRevenus}`,
        parameters: translateParams
      }
    };
  }
}

export function typeRevenusToCheckboxOptions(membre: Personne): (QuestionOption<string> | CheckboxGroup)[] {
  const translateParams = {who: membre.id === 0 ? 'me' : 'them', membre: membre.prenom};
  return [
    typeRevenusToOption(TypeRevenus.EMPLOI, membre),
    typeRevenusToOption(TypeRevenus.INDEPENDANT, membre),
    typeRevenusToOption(TypeRevenus.CHOMAGE, membre),
    {
      label: {
        key: 'common.typeRevenusGroup.AVS',
        parameters: translateParams
      }, options: [
        typeRevenusToOption(TypeRevenus.AVS_RETRAITE, membre),
        typeRevenusToOption(TypeRevenus.AVS_VEUF, membre),
        typeRevenusToOption(TypeRevenus.AVS_ENFANT, membre)
      ]
    },
    {
      label: {
        key: 'common.typeRevenusGroup.AI',
        parameters: translateParams
      }, options: [
        typeRevenusToOption(TypeRevenus.AI_ENFANT, membre),
        typeRevenusToOption(TypeRevenus.AI_INVALIDITE, membre)
      ]
    },
    typeRevenusToOption(TypeRevenus.APG, membre)
  ] as (QuestionOption<string> | CheckboxGroup)[];
}
