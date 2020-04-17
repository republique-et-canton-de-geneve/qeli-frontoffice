import { Personne } from '../../configuration/demandeur.model';
import { QuestionOption } from '../../../dynamic-question/model/question.model';
import { CheckboxGroup } from '../../../dynamic-question/checkbox-group-question/checkbox-group-question.model';

export enum TypeRevenus {
  EMPLOI        = "EMPLOI",
  CHOMAGE       = "CHOMAGE",
  AVS_RETRAITE  = "AVS_RETRAITE",
  AVS_VEUF      = "AVS_VEUF",
  AVS_ENFANT    = "AVS_ENFANT",
  AI_INVALIDITE = "AI_INVALIDITE",
  AI_ENFANT     = "AI_ENFANT",
  APG           = "APG"
}


const HAS_HELP = [TypeRevenus.APG];

export function isTypeRevenusAVS(typeRevenus: TypeRevenus | string) {
  return typeRevenus === TypeRevenus.AVS_RETRAITE ||
         typeRevenus === TypeRevenus.AVS_VEUF ||
         typeRevenus === TypeRevenus.AVS_ENFANT;
}

export function isTypeRevenusAI(typeRevenus: TypeRevenus | string) {
  return typeRevenus === TypeRevenus.AI_INVALIDITE ||
         typeRevenus === TypeRevenus.AI_ENFANT;
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
