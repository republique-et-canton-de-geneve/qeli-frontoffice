/**
 * Un enum qui représente une réponse Oui / Non à une question.
 */
import { QuestionOption } from '../../dynamic-question/model/question.model';

export enum ReponseBinaire {
  OUI = 'OUI',
  NON = 'NON'
}

/**
 * Un enum qui représente une réponse Oui / Non / Je ne sais pas à une question.
 */
export enum ReponseProgressive {
  OUI     = 'OUI',
  NON     = 'NON',
  INCONNU = 'INCONNU'
}


export const REPONSE_BINAIRE_OPTIONS: QuestionOption<string>[] = Object.keys(ReponseBinaire).map(reponse => ({
  value: reponse,
  label: {key: `common.reponseBinaire.${reponse}`}
}));

export const REPONSE_PROGRESSIVE_OPTIONS: QuestionOption<string>[] = Object.keys(ReponseBinaire).map(reponse => ({
  value: reponse,
  label: {key: `common.reponseBinaire.${reponse}`}
}));
