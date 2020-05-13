import { FormData } from '../../dynamic-question/model/question.model';
import { Answer, OptionAnswer } from '../../dynamic-question/model/answer.model';
import { CompositeAnswer } from '../../dynamic-question/composite-question/composite-question.model';
import { Demandeur, Personne } from '../configuration/demandeur.model';
import { Pays } from '../../dynamic-question/nationalite-question/pays.model';
import { NationaliteAnswer } from '../../dynamic-question/nationalite-question/nationalite-question.model';
import { RequerantRefugie } from './nationalite/requerant-refugie.model';
import { ReponseBinaire, ReponseProgressive } from './reponse-binaire.model';
import { TypeEnfant } from './enfants/type-enfant.model';
import { TypeRevenus } from './revenus/revenus.model';
import { CheckboxGroupAnswer } from '../../dynamic-question/checkbox-group-question/checkbox-group-question.model';

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

  static isEnFormation(formData: FormData, personne: Personne) {
    const answers = (formData['formation'] as CompositeAnswer).answers;
    const answer = (answers[`formation_${personne.id}`] as OptionAnswer<string>);
    const choosenOption = answer ? answer.value : null;

    return choosenOption && choosenOption.value === ReponseBinaire.OUI;
  }

  static isEnfantACharge(formData: FormData, enfant: Personne, demandeur: Demandeur) {
    return this.isEnfantOfDemandeur(formData, enfant, demandeur) && (
      !enfant.isMajeur || (enfant.age <= 25 && this.isEnFormation(formData, enfant))
    );
  }

  static isEnfantOfDemandeur(formData: FormData, enfant: Personne, demandeur: Demandeur) {
    const answers = (formData['parentsEnfants'] as CompositeAnswer).answers;
    const option = (answers[`parentsEnfants_${enfant.id}`] as OptionAnswer<string>).value;
    return option.value === TypeEnfant.MOI ||
           option.value === TypeEnfant.LES_DEUX ||
           (option.value === TypeEnfant.AUTRE_PARENT && demandeur.hasConjoint);
  }

  static hasEnfantACharge(formData: FormData, demandeur: Demandeur) {
    if (demandeur.enfants.length > 0) {
      return demandeur.enfants.some(enfant => this.isEnfantACharge(formData, enfant, demandeur));
    }
    return false;
  }

  static isRevenuInconnu(formData: FormData, personne: Personne) {
    const answer = (formData[`revenus_${personne.id}`] as CheckboxGroupAnswer);
    return answer && answer.hasSome && answer.hasSome.value === 'INCONNU';
  }

  static hasAnyRevenus(formData: FormData, personne: Personne, revenus: TypeRevenus[]) {
    const answer = (formData[`revenus_${personne.id}`] as CheckboxGroupAnswer);
    if (!answer || answer.hasSome.value !== 'OUI') {
      return false;
    }

    return (answer.choices.some(choice => revenus.includes(TypeRevenus[choice.value])));
  }

  static hasEnfantEnCommun(formData: FormData) {
    const parentEnfantsAnswer = (formData['parentsEnfants'] as CompositeAnswer);
    return parentEnfantsAnswer && Object.values(parentEnfantsAnswer.answers).some(answer => {
      const option = (answer as OptionAnswer<string>).value;
      return option.value === TypeEnfant.LES_DEUX;
    });
  }
}
