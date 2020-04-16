import { Demandeur, MembreFamille } from '../../configuration/demandeur.model';
import { QuestionOption } from '../../../dynamic-question/model/question.model';

export enum RequerantRefugie {
  REQUERANT_ASILE = 'REQUERANT_ASILE',
  REFUGIE         = 'REFUGIE',
  AUCUN           = 'AUCUN',
  INCONNU         = 'INCONNU'
}


export function requerantRefugieAsQuestionOptions(membre: Demandeur | MembreFamille): QuestionOption<string>[] {
  const translateParams = {who: membre.id === 0 ? 'me' : 'them', membre: membre.prenom};
  return [
    {
      value: RequerantRefugie.REQUERANT_ASILE,
      label: {
        key: `common.requerantRefugie.${RequerantRefugie.REQUERANT_ASILE}.label`,
        parameters: translateParams
      },
      help: {
        key: `common.requerantRefugie.${RequerantRefugie.REQUERANT_ASILE}.help`,
        parameters: translateParams
      }
    },
    {
      value: RequerantRefugie.REFUGIE,
      label: {
        key: `common.requerantRefugie.${RequerantRefugie.REFUGIE}.label`,
        parameters: translateParams
      },
      help: {
        key: `common.requerantRefugie.${RequerantRefugie.REFUGIE}.help`,
        parameters: translateParams
      }
    },
    {
      value: RequerantRefugie.AUCUN,
      label: {
        key: `common.requerantRefugie.${RequerantRefugie.AUCUN}`,
        parameters: translateParams
      }
    },
    {
      value: RequerantRefugie.INCONNU,
      label: {
        key: `common.requerantRefugie.${RequerantRefugie.INCONNU}`,
        parameters: translateParams
      }
    }
  ];
}
