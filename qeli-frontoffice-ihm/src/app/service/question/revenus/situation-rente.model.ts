import { Personne } from '../../configuration/demandeur.model';
import { QuestionOption } from '../../../dynamic-question/model/question.model';
import { CheckboxGroup } from '../../../dynamic-question/checkbox-group-question/checkbox-group-question.model';

export enum SituationRente {
  RECONNU_OCAI        = "RECONNU_OCAI",
  RETRAITE_SANS_RENTE = "RETRAITE_SANS_RENTE",
  VEUF_SANS_RENTE     = "VEUF_SANS_RENTE"
}

const HAS_HELP = [SituationRente.RECONNU_OCAI];

export function situationRenteToOption(situationRente: SituationRente, membre: Personne): QuestionOption<string> {
  const translateParams = {who: membre.id === 0 ? 'me' : 'them', membre: membre.prenom};

  if (HAS_HELP.includes(situationRente)) {
    return {
      value: situationRente,
      label: {
        key: `common.situationRente.${situationRente}.label`,
        parameters: translateParams
      },
      help: {
        key: `common.situationRente.${situationRente}.help`,
        parameters: translateParams
      }
    };
  } else {
    return {
      value: situationRente,
      label: {
        key: `common.situationRente.${situationRente}`,
        parameters: translateParams
      }
    };
  }
}

export function situationRenteAsOptions(membre: Personne): (QuestionOption<string> | CheckboxGroup)[] {
  return Object.values(SituationRente).map(situationRente => situationRenteToOption(situationRente, membre));
}
