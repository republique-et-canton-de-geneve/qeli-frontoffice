import { QuestionOption } from '../../../dynamic-question/model/question.model';

export enum Scolarite {
  SCOLARITE_OBLIGATOIRE_1P_A_10P = 'SCOLARITE_OBLIGATOIRE_1P_A_10P',
  SCOLARITE_OBLIGATOIRE_11P      = 'SCOLARITE_OBLIGATOIRE_11P',
  FORMATION_DOCTORALE            = 'FORMATION_DOCTORALE',
  FORMATION_CONTINUE             = 'FORMATION_CONTINUE',
  AUCUNE                         = "AUCUNE",
  INCONNU                        = "INCONNU"
}

const HAS_HELP = [Scolarite.SCOLARITE_OBLIGATOIRE_11P,
                  Scolarite.FORMATION_DOCTORALE,
                  Scolarite.FORMATION_CONTINUE];

export function scolariteToOption(scolarite: Scolarite): QuestionOption<string> {
  if (HAS_HELP.includes(scolarite)) {
    return {
      value: scolarite,
      label: {key: `common.scolarite.${scolarite}.label`},
      help: {key: `common.scolarite.${scolarite}.help`}
    };
  } else {
    return {
      value: scolarite,
      label: {key: `common.scolarite.${scolarite}`}
    };
  }
}
