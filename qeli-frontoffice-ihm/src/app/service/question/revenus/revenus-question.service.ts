import { QuestionLoader } from '../question-loader';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { TYPE_REVENUS_AI, TYPE_REVENUS_AVS, TypeRevenus, typeRevenusToCheckboxOptions } from './revenus.model';
import { Categorie, QeliQuestionDecorator, RefusEligibiliteFn } from '../qeli-question-decorator.model';
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
    const eligibiliteGroup = new EligibiliteGroup(this.demandeur.toEligibilite(), this.demandeur);
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
            if (skipEligibilites.filter(eligibilite => eligibilite.membreId === membre.id)
                                .every(eligibilite => eligibilite.prestation === Prestation.PC_FAM)) {
              return membre.id !== this.demandeur.id &&
                     this.demandeur.hasConcubin &&
                     !AnswerUtils.hasEnfantEnCommun(formData)
            }

            return false;
          },
          calculateRefus: this.calculateRevenusRefusFn(membre).bind(this),
          eligibilites: eligibilitesRevenus,
          categorie: Categorie.REVENUS
        },
        {
          question: new CheckboxGroupQuestion({
            key: `situationRente_${membre.id}`,
            dataCyIdentifier: `0602_situationRente_${membre.id}`,
            introduction: {key: 'question.situationRente.preface'},
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
          calculateRefus: this.calculateSituationRenteRefusFn(membre).bind(this),
          eligibilites: eligibiliteGroup.findByPrestationEtMembre(Prestation.PC_AVS_AI, membre),
          categorie: Categorie.REVENUS
        }
      ];
    }).reduce((result, current) => result.concat(current), []);
  }

  private hasAnyRevenusAVSOrAI(formData: FormData, membre: Personne) {
    return AnswerUtils.hasAnyRevenus(formData, membre, TYPE_REVENUS_AVS.concat(TYPE_REVENUS_AI));
  }

  private calculateRevenusRefusFn(membre: Personne): RefusEligibiliteFn {
    return (formData: FormData, eligibilites: Eligibilite[]): EligibiliteRefusee[] => {
      const refus: EligibiliteRefusee[] = [];
      const eligibiliteToMotifRefus = eligibilite => ({
        key: `question.revenus.motifRefus.${eligibilite.prestation}`,
        parameters: {who: membre.id === 0 ? 'me' : 'them', membre: membre.prenom}
      });
      const eligibiliteGroup = new EligibiliteGroup(eligibilites, this.demandeur);

      if (!this.hasAnyRevenusAVSOrAI(formData, membre)) {
        // Refus PC AVS AI si la personne ne reçoit pas de rente AVS / AI et qu'elle mineur ou qu'elle est d'un pays
        // sans convention.
        if (!membre.isMajeur || AnswerUtils.isNationaliteIn(formData, membre, PAYS_NON_CONVENTIONES)) {
          QuestionUtils.createRefusByPrestationAndMembre(
            eligibiliteGroup, Prestation.PC_AVS_AI, membre, eligibiliteToMotifRefus
          ).forEach(eligibiliteRefusee => refus.push(eligibiliteRefusee));
        }
      }

      if (this.hasAnyRevenusAVSOrAI(formData, membre)) {
        // Refus PC FAM et Aide sociale si la personne touche une rente AVS / AI
        if (this.demandeur.id === membre.id ||
            this.demandeur.hasConjoint && this.demandeur.partenaire.id === membre.id) {
          // Refus PC FAM pour toute la famille si le benéficiaire des de la Rente est un des deux conjoints.
          QuestionUtils.createRefusByPrestation(
            eligibiliteGroup, Prestation.PC_FAM, eligibiliteToMotifRefus
          ).forEach(eligibiliteRefusee => refus.push(eligibiliteRefusee));
        } else {
          QuestionUtils.createRefusByPrestationAndMembre(
            eligibiliteGroup, Prestation.PC_FAM, membre, eligibiliteToMotifRefus
          ).forEach(eligibiliteRefusee => refus.push(eligibiliteRefusee));
        }

        QuestionUtils.createRefusByPrestationAndMembre(
          eligibiliteGroup, Prestation.AIDE_SOCIALE, membre, eligibiliteToMotifRefus
        ).forEach(eligibiliteRefusee => refus.push(eligibiliteRefusee));
      } else if (AnswerUtils.hasAnyRevenus(formData, membre, TypeRevenus.INDEPENDANT)) {
        // Refus PC FAM si la personne est indépendante.
        QuestionUtils.createRefusByPrestationAndMembre(
          eligibiliteGroup, Prestation.PC_FAM, membre, eligibiliteToMotifRefus
        ).forEach(eligibiliteRefusee => refus.push(eligibiliteRefusee));
      } else if (
        !AnswerUtils.isRevenuInconnu(formData, membre) &&
        !AnswerUtils.hasAnyRevenus(formData, membre, [TypeRevenus.EMPLOI, TypeRevenus.CHOMAGE, TypeRevenus.APG])
      ) {
        // Refus PC FAM si la personne n'est ni employée, ni au chômage ni reçoit des indemnités journalières / perte
        // de gain.
        QuestionUtils.createRefusByPrestationAndMembre(
          eligibiliteGroup, Prestation.PC_FAM, membre, eligibiliteToMotifRefus
        ).forEach(eligibiliteRefusee => refus.push(eligibiliteRefusee));
      }


      if (AnswerUtils.hasAnyRevenus(
        formData, membre, [TypeRevenus.CHOMAGE, TypeRevenus.AVS_RETRAITE, TypeRevenus.AI_INVALIDITE])
      ) {
        // Refus BOURSES si la personne est au Chomage ou touche une rente AVS Retraite ou AVS Invalidité.
        QuestionUtils.createRefusByPrestationAndMembre(
          eligibiliteGroup, Prestation.BOURSES, membre, eligibiliteToMotifRefus
        ).forEach(eligibiliteRefusee => refus.push(eligibiliteRefusee));
      }

      return refus;
    };
  }

  private calculateSituationRenteRefusFn(membre: Personne): RefusEligibiliteFn {
    return (formData: FormData, eligibilites: Eligibilite[]): EligibiliteRefusee[] => {
      const situationRenteAnswer = formData[`situationRente_${membre.id}`] as CheckboxGroupAnswer;
      const eligibiliteGroup = new EligibiliteGroup(eligibilites, this.demandeur);


      if (situationRenteAnswer.hasSome.value === 'NON') {
        return QuestionUtils.createRefusByPrestationAndMembre(
          // Refus PC AVS AI si aucune des options n'est pas coché.
          eligibiliteGroup, Prestation.PC_AVS_AI, membre, eligibilite => ({
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
