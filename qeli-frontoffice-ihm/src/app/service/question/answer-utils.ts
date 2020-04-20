import { FormData } from '../../dynamic-question/model/question.model';
import { Answer, OptionAnswer } from '../../dynamic-question/model/answer.model';
import { CompositeAnswer } from '../../dynamic-question/composite-question/composite-question.model';
import { Personne } from '../configuration/demandeur.model';
import { Pays } from '../../dynamic-question/nationalite-question/pays.model';
import { NationaliteAnswer } from '../../dynamic-question/nationalite-question/nationalite-question.model';
import { RequerantRefugie } from './nationalite/requerant-refugie.model';
import { ReponseProgressive } from './reponse-binaire.model';

export class AnswerUtils {

  static findAnswerByKey(formData: FormData, key: string): Answer {
    const findAnswer = (path: string[], index: number, answers: { [key: string]: Answer }) => {
      if (index === path.length - 1) {
        return answers[path[index]];
      }

      const currentAnswer = answers[path[index]] as CompositeAnswer;
      if (!currentAnswer) {
        return null;
      }

      return findAnswer(path, index + 1, currentAnswer.answers);
    };

    return findAnswer(key.split('.'), 0, formData);
  }

  static isNationalite(formData: FormData, membre: Personne, pays: Pays) {
    return this.isNationaliteIn(formData, membre, [pays]);
  }

  static isNationaliteIn(formData: FormData, membre: Personne, pays: Pays[]) {
    const nationaliteAnswer = this.findAnswerByKey(
      formData, `situationMembre_${membre.id}.nationalite`
    ) as NationaliteAnswer;

    return nationaliteAnswer && nationaliteAnswer.pays.some(option => pays.includes(option.value));
  }

  static isApatride(formData: FormData, membre: Personne) {
    const nationaliteAnswer = this.findAnswerByKey(
      formData, `situationMembre_${membre.id}.nationalite`
    ) as NationaliteAnswer;

    return nationaliteAnswer && nationaliteAnswer.apatride;
  }

  static isRefugie(formData: FormData, membre: Personne) {
    const refugieAnswer = this.findAnswerByKey(
      formData, `situationMembre_${membre.id}.refugie`
    ) as OptionAnswer<string>;
    const choosenRefugieOption = refugieAnswer ? refugieAnswer.value : null;

    return choosenRefugieOption && choosenRefugieOption.value === RequerantRefugie.REFUGIE;
  }

  static hasPermisBEtudes(formData: FormData, membre: Personne) {
    const permisBEtudesAnswer = this.findAnswerByKey(
      formData, `permisBEtudes.permisBEtudes_${membre.id}`
    ) as OptionAnswer<string>;
    const choosenOption = permisBEtudesAnswer ? permisBEtudesAnswer.value : null;

    return choosenOption && choosenOption.value === ReponseProgressive.OUI;
  }
}
