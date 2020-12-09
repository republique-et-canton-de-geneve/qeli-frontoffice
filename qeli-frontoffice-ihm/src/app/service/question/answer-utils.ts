import { FormData } from '../../dynamic-question/model/question.model';
import { Answer, OptionAnswer } from '../../dynamic-question/model/answer.model';
import { CompositeAnswer } from '../../dynamic-question/composite-question/composite-question.model';
import { Demandeur, Personne } from '../configuration/demandeur.model';
import { Pays } from '../../dynamic-question/nationalite-question/pays.model';
import { NationaliteAnswer } from '../../dynamic-question/nationalite-question/nationalite-question.model';
import { ReponseBinaire } from './reponse-binaire.model';
import { TypeEnfant } from './enfants/type-enfant.model';
import { TypeRevenus } from './revenus/revenus.model';
import { CheckboxGroupAnswer } from '../../dynamic-question/checkbox-group-question/checkbox-group-question.model';
import { TypePermis, TypePermisB, TypePermisC, TypePermisF } from './nationalite/type-permis.model';
import { Scolarite } from './formation/scolarite.model';

/**
 * Une collection de méthodes permettant l'extraction des informations à partir des réponse de l'utilisateur.
 */
export class AnswerUtils {

  private static findAnswerByKey(formData: FormData, key: string): Answer {
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

  private static getOptionAnswer(formData: FormData, key: string) {
    const answer = this.findAnswerByKey(formData, key) as OptionAnswer<string>;
    return answer ? answer.value : null;
  }

  private static checkOptionAnswer(formData: FormData, key: string, value: string) {
    const choosenOption = this.getOptionAnswer(formData, key);
    return choosenOption && choosenOption.value === value;
  }

  static getCheckboxGroupAnswer(formData: FormData, key: string) {
    return this.findAnswerByKey(formData, key) as CheckboxGroupAnswer;
  }

  static isNationalite(formData: FormData, personne: Personne, pays: Pays) {
    return this.isNationaliteIn(formData, personne, [pays]);
  }

  static isNationaliteIn(formData: FormData, personne: Personne, pays: Pays[]) {
    const nationaliteAnswer = this.findAnswerByKey(
      formData, `nationalite.nationalite_${personne.id}`
    ) as NationaliteAnswer;

    return nationaliteAnswer && nationaliteAnswer.pays.some(option => pays.includes(option.value));
  }

  static isApatride(formData: FormData, personne: Personne) {
    const nationaliteAnswer = this.findAnswerByKey(
      formData, `nationalite.nationalite_${personne.id}`
    ) as NationaliteAnswer;

    return nationaliteAnswer && nationaliteAnswer.apatride;
  }

  static isRefugie(formData: FormData, personne: Personne) {
    return this.checkOptionAnswer(formData, `situationPermis_${personne.id}.complementPermisB`, TypePermisB.REFUGIE) ||
           this.checkOptionAnswer(formData, `situationPermis_${personne.id}.complementPermisC`, TypePermisC.REFUGIE) ||
           this.checkOptionAnswer(formData, `situationPermis_${personne.id}.complementPermisF`, TypePermisF.REFUGIE);
  }

  static hasPermisBEtudes(formData: FormData, personne: Personne) {
    return this.checkOptionAnswer(formData, `situationPermis_${personne.id}.complementPermisB`, TypePermisB.ETUDES);
  }

  static isEnFormation(formData: FormData, personneId: number) {
    return this.checkOptionAnswer(formData, `formation.formation_${personneId}`, ReponseBinaire.OUI);
  }

  static isEnfantACharge(formData: FormData, enfant: Personne, demandeur: Demandeur) {
    return this.isEnfantOfDemandeur(formData, enfant, demandeur) && (
      !enfant.isMajeur || (enfant.age <= 25 && this.isEnFormation(formData, enfant.id))
    );
  }

  static isEnfantOfDemandeur(formData: FormData, enfant: Personne, demandeur: Demandeur) {
    const parentsEnfantsAnswer = this.findAnswerByKey(
      formData, `parentsEnfants.parentsEnfants_${enfant.id}`
    ) as OptionAnswer<string>;
    const choosenOption = parentsEnfantsAnswer ? parentsEnfantsAnswer.value : null;

    return choosenOption.value === TypeEnfant.MOI ||
           choosenOption.value === TypeEnfant.LES_DEUX ||
           (choosenOption.value === TypeEnfant.AUTRE_PARENT && demandeur.hasConjoint);
  }

  static hasEnfantACharge(formData: FormData, demandeur: Demandeur) {
    if (demandeur.enfants.length > 0) {
      return demandeur.enfants.some(enfant => this.isEnfantACharge(formData, enfant, demandeur));
    }
    return false;
  }

  static isRevenuInconnu(formData: FormData, personne: Personne) {
    const answer = this.getCheckboxGroupAnswer(formData, `revenus_${personne.id}.situationRevenus`);
    return answer && answer.hasSome && answer.hasSome.value === 'INCONNU';
  }

  static hasAnyRevenus(formData: FormData, personne: Personne, revenus: TypeRevenus | TypeRevenus[]) {
    const _revenus = Array.isArray(revenus) ? revenus as TypeRevenus[] : [revenus as TypeRevenus];
    const answer = this.getCheckboxGroupAnswer(formData, `revenus_${personne.id}.situationRevenus`);
    if (!answer || answer.hasSome.value !== 'OUI') {
      return false;
    }

    return (answer.choices.some(choice => _revenus.includes(TypeRevenus[choice.value])));
  }

  static hasEnfantEnCommun(formData: FormData) {
    const parentEnfantsAnswer = (formData['parentsEnfants'] as CompositeAnswer);
    return parentEnfantsAnswer && Object.values(parentEnfantsAnswer.answers).some(answer => {
      const option = (answer as OptionAnswer<string>).value;
      return option.value === TypeEnfant.LES_DEUX;
    });
  }

  static isEnfantType(formData: FormData, enfantId: number, typeEnfant: TypeEnfant) {
    return this.checkOptionAnswer(formData, `parentsEnfants.parentsEnfants_${enfantId}`, typeEnfant);
  }

  static isScolarite(formData: FormData, personId: number, scolarite: Scolarite) {
    return this.checkOptionAnswer(formData, `scolarite_${personId}`, scolarite);
  }

  static isTaxationOffice(formData: FormData) {
    return this.checkOptionAnswer(formData, 'taxationOffice', 'OUI');
  }

  static hasAnyPermis(formData: FormData, personId: number, types: TypePermis[]) {
    const selectedType = this.getOptionAnswer(formData, `situationPermis_${personId}.typePermis`);
    const selectedTypeValue = selectedType ? TypePermis[selectedType.value] : null;
    return (types || []).includes(selectedTypeValue);
  }
}
