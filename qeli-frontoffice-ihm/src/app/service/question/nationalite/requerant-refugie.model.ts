import { Personne } from '../../configuration/demandeur.model';
import { QuestionOption } from '../../../dynamic-question/model/question.model';

export enum RequerantRefugie {
  REQUERANT_ASILE = 'REQUERANT_ASILE',
  REFUGIE         = 'REFUGIE',
  AUCUN           = 'AUCUN',
  INCONNU         = 'INCONNU'
}


const HAS_HELP = [RequerantRefugie.REQUERANT_ASILE, RequerantRefugie.REFUGIE];

export function refugieToOption(requerantRefugie: RequerantRefugie, membre: Personne): QuestionOption<string> {
  const translateParams = {who: membre.id === 0 ? 'me' : 'them', membre: membre.prenom};

  if (HAS_HELP.includes(requerantRefugie)) {
    return {
      value: requerantRefugie,
      label: {
        key: `common.requerantRefugie.${requerantRefugie}.label`,
        parameters: translateParams
      },
      help: {
        key: `common.requerantRefugie.${requerantRefugie}.help`,
        parameters: translateParams
      }
    };
  } else {
    return {
      value: requerantRefugie,
      label: {
        key: `common.requerantRefugie.${requerantRefugie}`,
        parameters: translateParams
      }
    };
  }
}

export function requerantRefugieAsQuestionOptions(membre: Personne): QuestionOption<string>[] {
  return Object.values(RequerantRefugie).map(requerantRefugie => refugieToOption(requerantRefugie, membre));
}
