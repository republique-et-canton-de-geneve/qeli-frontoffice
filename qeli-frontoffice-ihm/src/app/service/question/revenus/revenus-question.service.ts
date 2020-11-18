import { QuestionLoader } from '../question-loader';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { isTypeRevenusAI, isTypeRevenusAVS, TypeRevenus, typeRevenusToCheckboxOptions } from './revenus.model';
import { Categorie, QeliQuestionDecorator, RefusEligibiliteFn, Subcategorie } from '../qeli-question-decorator.model';
import { Eligibilite, EligibiliteGroup, EligibiliteRefusee } from '../eligibilite.model';
import {
  CheckboxGroupAnswer, CheckboxGroupQuestion
} from '../../../dynamic-question/checkbox-group-question/checkbox-group-question.model';
import { Personne } from '../../configuration/demandeur.model';
import { FormData, QuestionOption } from '../../../dynamic-question/model/question.model';
import { Prestation } from '../../configuration/prestation.model';
import { PAYS_NON_CONVENTIONES } from '../../../dynamic-question/nationalite-question/pays.model';
import { situationRenteAsOptions } from './situation-rente.model';
import { AnswerUtils } from '../answer-utils';
import { QuestionUtils } from '../qeli-questions.utils';

export class RevenusQuestionService extends QuestionLoader {

  loadQuestions(configuration: QeliConfiguration): QeliQuestionDecorator<any>[] {
    const eligibiliteGroup = new EligibiliteGroup(this.demandeur.toEligibilite());
    const membres = ([this.demandeur] as Personne[]).concat(this.demandeur.membresFamille);

    return membres.map((membre): QeliQuestionDecorator<any>[] => {
      const translateParams = {who: membre.id === 0 ? 'me' : 'them', membre: membre.prenom};
      const isParent = membre.id === this.demandeur.id ||
                       (this.demandeur.partenaire && this.demandeur.partenaire.id === membre.id);
      const eligibilitesRevenus = (
        (isParent) ? eligibiliteGroup.findByPrestation(Prestation.PC_FAM) : []
      ).concat(
        eligibiliteGroup.findByPrestationEtMembre([
          Prestation.AIDE_SOCIALE,
          Prestation.PC_AVS_AI,
          Prestation.BOURSES], membre
        )
      );
      return [
        {
          question: new CheckboxGroupQuestion({
            key: `revenus_${membre.id}`,
            dataCyIdentifier: `0601_revenus_${membre.id}`,
            label: {
              key: 'question.revenus.label',
              parameters: translateParams
            },
            help: {
              key: 'question.revenus.help',
              parameters: translateParams
            },
            errorLabels: QuestionUtils.toErrorLabels('revenus', ['required', 'atLeastOneSelected']),
            hasSomeOptions: checkboxGroupNoneOptionsFor('revenus', membre),
            checkboxOptions: typeRevenusToCheckboxOptions(membre)
          }),
          skip: (formData, skipEligibilites) => {
            if (skipEligibilites.filter(eligibilite => eligibilite.membre.id === membre.id)
                                .every(eligibilite => eligibilite.prestation === Prestation.PC_FAM)) {
              return membre.id !== this.demandeur.id &&
                     this.demandeur.hasConcubin &&
                     !AnswerUtils.hasEnfantEnCommun(formData)
            }

            return false;
          },
          calculateRefus: this.calculateRevenusRefusFn(membre),
          eligibilites: eligibilitesRevenus,
          categorie: Categorie.SITUATION_PERSONELLE,
          subcategorie: Subcategorie.REVENUS
        },
        {
          question: new CheckboxGroupQuestion({
            key: `situationRente_${membre.id}`,
            dataCyIdentifier: `0602_situationRente_${membre.id}`,
            preface: {key: 'question.situationRente.preface'},
            label: {
              key: 'question.situationRente.label',
              parameters: translateParams
            },
            errorLabels: {
              required: {key: 'question.situationRente.error.required'},
              atLeastOneSelected: {key: 'question.situationRente.error.atLeastOneSelected'}
            },
            hasSomeOptions: checkboxGroupNoneOptionsFor('situationRente', membre, false),
            checkboxOptions: situationRenteAsOptions(membre)
          }),
          skip: formData => this.hasAnyRevenusAVSOrAI(formData, membre),
          calculateRefus: this.calculateSituationRenteRefusFn(membre),
          eligibilites: eligibiliteGroup.findByPrestationEtMembre(Prestation.PC_AVS_AI, membre),
          categorie: Categorie.SITUATION_PERSONELLE,
          subcategorie: Subcategorie.REVENUS
        }
      ];
    }).reduce((result, current) => result.concat(current), []);
  }

  private hasAnyRevenusAVSOrAI(formData: FormData, membre: Personne) {
    const revenusAnswer = formData[`revenus_${membre.id}`] as CheckboxGroupAnswer;
    const choices = revenusAnswer.choices;
    return choices.some(choice => isTypeRevenusAI(choice.value) || isTypeRevenusAVS(choice.value));
  }

  private calculateRevenusRefusFn(membre: Personne): RefusEligibiliteFn {
    return (formData: FormData, eligibilites: Eligibilite[]): EligibiliteRefusee[] => {
      const refus: EligibiliteRefusee[] = [];
      const revenusAnswer = formData[`revenus_${membre.id}`] as CheckboxGroupAnswer;
      const isInconnu = revenusAnswer.hasSome.value === 'INCONNU';
      const choices = revenusAnswer.choices;
      const eligibiliteToMotifRefus = eligibilite => ({
        key: `question.revenus.motifRefus.${eligibilite.prestation}`,
        parameters: {who: membre.id === 0 ? 'me' : 'them', membre: membre.prenom}
      });

      if (!choices.some(choice => isTypeRevenusAI(choice.value) || isTypeRevenusAVS(choice.value))) {
        // Refus PC AVS AI si la personne ne reçoit pas de rente AVS / AI et qu'elle mineur ou qu'elle est d'un pays
        // sans convention.
        if (!membre.isMajeur || AnswerUtils.isNationaliteIn(formData, membre, PAYS_NON_CONVENTIONES)) {
          QuestionUtils.createRefusByPrestationAndMembre(
            eligibilites, Prestation.PC_AVS_AI, membre, eligibiliteToMotifRefus
          ).forEach(eligibiliteRefusee => refus.push(eligibiliteRefusee));
        }
      }

      if (choices.some(choice => isTypeRevenusAI(choice.value) || isTypeRevenusAVS(choice.value))) {
        // Refus PC FAM et Aide sociale si la personne touche une rente AVS / AI
        if (this.demandeur.id === membre.id ||
            this.demandeur.partenaire.id === membre.id && this.demandeur.hasConjoint) {
          // Refus PC FAM pour toute la famille si le benéficiaire des de la Rente est un des deux conjoints.
          QuestionUtils.createRefusByPrestation(eligibilites, Prestation.PC_FAM, eligibiliteToMotifRefus);
        } else {
          QuestionUtils.createRefusByPrestationAndMembre(
            eligibilites, Prestation.PC_FAM, membre, eligibiliteToMotifRefus);
        }

        QuestionUtils.createRefusByPrestationAndMembre(
          eligibilites, Prestation.AIDE_SOCIALE, membre, eligibiliteToMotifRefus);
      } else if (!isInconnu && !choices.some(choice => choice.value === TypeRevenus.EMPLOI ||
                                                       choice.value === TypeRevenus.CHOMAGE ||
                                                       choice.value === TypeRevenus.APG)) {
        // Refus PC FAM si la personne n'est ni employée, ni au chômage ni reçoit des indemnités journalières / perte
        // de gain.
        QuestionUtils.createRefusByPrestationAndMembre(
          eligibilites, Prestation.PC_FAM, membre, eligibiliteToMotifRefus
        ).forEach(eligibiliteRefusee => refus.push(eligibiliteRefusee));
      }


      if (choices.some(choice => choice.value === TypeRevenus.CHOMAGE ||
                                 choice.value === TypeRevenus.AVS_RETRAITE ||
                                 choice.value === TypeRevenus.AI_INVALIDITE)) {
        // Refus BOURSES si la personne est au Chomage ou touche une rente AVS Retraite ou AVS Invalidité.
        QuestionUtils.createRefusByPrestationAndMembre(
          eligibilites, Prestation.BOURSES, membre, eligibiliteToMotifRefus
        ).forEach(eligibiliteRefusee => refus.push(eligibiliteRefusee));
      }

      return refus;
    };
  }

  private calculateSituationRenteRefusFn(membre: Personne): RefusEligibiliteFn {
    return (formData: FormData, eligibilites: Eligibilite[]): EligibiliteRefusee[] => {
      const situationRenteAnswer = formData[`situationRente_${membre.id}`] as CheckboxGroupAnswer;

      if (situationRenteAnswer.hasSome.value === 'NON') {
        return QuestionUtils.createRefusByPrestationAndMembre(
          // Refus PC AVS AI si aucune des options n'est pas coché.
          eligibilites, Prestation.PC_AVS_AI, membre, eligibilite => ({
            key: `question.situationRente.motifRefus.${eligibilite.prestation}`,
            parameters: {who: membre.id === 0 ? 'me' : 'them', membre: membre.prenom}
          })
        );
      }
      return [];
    };
  }
}

function checkboxGroupNoneOptionsFor(questionKey: string,
                                     membre: Personne,
                                     hasInconnu: boolean = true): QuestionOption<'OUI' | 'NON' | 'INCONNU'>[] {
  const translateParams = {who: membre.id === 0 ? 'me' : 'them', membre: membre.prenom};
  const options: QuestionOption<'OUI' | 'NON' | 'INCONNU'>[] = [
    {
      value: 'OUI',
      label: {
        key: `question.${questionKey}.some`,
        parameters: translateParams
      }
    },
    {
      value: 'NON',
      label: {
        key: `question.${questionKey}.none`,
        parameters: translateParams
      }
    }
  ];

  if (hasInconnu) {
    options.push({
      value: 'INCONNU',
      label: {key: `question.${questionKey}.inconnu`}
    });
  }

  return options;
}
