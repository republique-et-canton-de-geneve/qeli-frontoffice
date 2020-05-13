import { Injectable } from '@angular/core';
import { QuestionLoader } from '../question-loader';
import {
  CheckboxGroup, CheckboxGroupAnswer, CheckboxGroupQuestion
} from '../../../dynamic-question/checkbox-group-question/checkbox-group-question.model';
import { Prestation } from '../../configuration/prestation.model';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { FormData, QuestionOption } from '../../../dynamic-question/model/question.model';
import { Eligibilite, EligibiliteGroup, EligibiliteRefusee } from '../eligibilite.model';
import { Categorie, QeliQuestionDecorator, Subcategorie } from '../qeli-question-decorator.model';
import { Demandeur } from '../../configuration/demandeur.model';
import { QuestionUtils } from '../qeli-questions.utils';
import { AnswerUtils } from '../answer-utils';

@Injectable({
  providedIn: 'root'
})
export class PrestationQuestionService implements QuestionLoader {

  loadQuestions(configuration: QeliConfiguration, eligibilites: Eligibilite[]): QeliQuestionDecorator<any>[] {
    const eligibiliteAsGroup = new EligibiliteGroup(eligibilites);
    return [
      {
        question: new CheckboxGroupQuestion({
          key: 'prestations',
          dataCyIdentifier: '0101_prestations',
          label: {
            key: 'question.prestations.label',
            parameters: {numberOfMemebres: eligibiliteAsGroup.demandeur.membresFamille.length}
          },
          errorLabels: QuestionUtils.toErrorLabels('prestations', ['required', 'atLeastOneSelected']),
          help: {key: 'question.prestations.help'},
          hasSomeOptions: [
            {
              value: 'OUI',
              label: {
                key: 'question.prestations.some',
                parameters: {numberOfMemebres: eligibiliteAsGroup.demandeur.membresFamille.length}
              }
            },
            {
              value: 'NON',
              label: {
                key: 'question.prestations.none',
                parameters: {numberOfMemebres: eligibiliteAsGroup.demandeur.membresFamille.length}
              }
            },
            {value: 'INCONNU', label: {key: 'question.prestations.inconnu'}}
          ],
          checkboxOptions: Object.keys(Prestation).map(prestation => {
            if (prestation === Prestation.SUBSIDES || prestation === Prestation.BOURSES) {
              const checkBoxGroupOptions = eligibiliteAsGroup.findByPrestation(prestation).map(eligibilite => ({
                value: `${prestation}_${eligibilite.membre.id}`,
                label: {
                  key: `question.prestations.option.${prestation}`,
                  parameters: {
                    who: eligibilite.membre.id === 0 ? 'me' : 'them',
                    membre: eligibilite.membre.prenom,
                    numberOfMemebres: eligibiliteAsGroup.demandeur.membresFamille.length
                  }
                }
              })) as QuestionOption<string>[];

              return (eligibiliteAsGroup.demandeur.membresFamille.length > 0) ? [{
                label: {key: `question.prestations.checkboxGroup.${prestation}`},
                options: checkBoxGroupOptions
              }] as CheckboxGroup[] : checkBoxGroupOptions;
            }
            return [{
              value: prestation, label: {key: `question.prestations.option.${prestation}`}
            }] as QuestionOption<string>[];
          }).reduce((result, current) => result.concat(current), [] as (QuestionOption<string> | CheckboxGroup)[])
        }),
        eligibilites: eligibilites,
        calculateRefus: this.calculateRefus.bind(this),
        categorie: Categorie.SITUATION_PERSONELLE,
        subcategorie: Subcategorie.PRESTATION
      }
    ];
  }

  private calculateRefus(formData: FormData, eligibilites: Eligibilite[]) {
    const refus: EligibiliteRefusee[] = [];
    const prestationsAnswer = formData['prestations'] as CheckboxGroupAnswer;
    const eligibiliteToMotif = eligibilite => ({key: `question.prestations.motifRefus.${eligibilite.prestation}`});

    if (prestationsAnswer.hasSome.value === 'OUI') {
      const choices = prestationsAnswer.choices;

      // Création des refus pour les prestations cochées (c'est-à-dire déjà perçues).
      eligibilites.map(eligibilite => {
        const prestation = eligibilite.prestation;
        const membre = eligibilite.membre;

        if (prestation === Prestation.SUBSIDES || prestation === Prestation.BOURSES) {
          if (choices.some(choice => choice.value === `${prestation}_${membre.id}`)) {
            return {eligibilite: eligibilite, dejaPercue: true} as EligibiliteRefusee;
          }
        } else if (choices.some(choice => choice.value === prestation)) {
          return {eligibilite: eligibilite, dejaPercue: true} as EligibiliteRefusee;
        }

        return null;
      }).filter(refus => refus !== null).forEach(eligibiliteRefusee => refus.push(eligibiliteRefusee));

      // Création des refus pour les prestations incompatibles.
      if (choices.some(choice => choice.value === Prestation.PC_AVS_AI)) {
        QuestionUtils.createRefusByPrestation(
          eligibilites, [Prestation.SUBSIDES, Prestation.ALLOCATION_LOGEMENT, Prestation.PC_FAM], eligibiliteToMotif
        ).forEach(eligibiliteRefusee => {
          if (!this.isEligibiliteRefusee(refus, eligibiliteRefusee.eligibilite)) {
            refus.push(eligibiliteRefusee);
          }
        });
      }

      if (choices.some(choice => choice.value === Prestation.PC_FAM)) {
        QuestionUtils.createRefusByPrestation(
          eligibilites, [Prestation.SUBSIDES, Prestation.PC_AVS_AI], eligibiliteToMotif
        ).forEach(eligibiliteRefusee => {
          if (!this.isEligibiliteRefusee(refus, eligibiliteRefusee.eligibilite)) {
            refus.push(eligibiliteRefusee);
          }
        });
      }

      if (choices.some(choice => choice.value === Prestation.AIDE_SOCIALE)) {
        QuestionUtils.createRefusByPrestation(
          eligibilites, Prestation.SUBSIDES, eligibiliteToMotif
        ).forEach(eligibiliteRefusee => {
          if (!this.isEligibiliteRefusee(refus, eligibiliteRefusee.eligibilite)) {
            refus.push(eligibiliteRefusee);
          }
        });
      }

      if (choices.some(choice => choice.value === Prestation.SUBVENTION_HM)) {
        QuestionUtils.createRefusByPrestation(
          eligibilites, Prestation.ALLOCATION_LOGEMENT, eligibiliteToMotif
        ).forEach(eligibiliteRefusee => {
          if (!this.isEligibiliteRefusee(refus, eligibiliteRefusee.eligibilite)) {
            refus.push(eligibiliteRefusee);
          }
        });
      }
    }

    const eligibiliteAsGroup = new EligibiliteGroup(eligibilites);
    const demandeur = eligibiliteAsGroup.demandeur;

    if (!this.hasEnfantsMoins25Ans(demandeur)) {
      QuestionUtils.createRefusByPrestation(
        eligibilites, Prestation.PC_FAM, eligibilite => ({
          key: `question.prestations.motifRefus.${eligibilite.prestation}_SANS_ENFANTS`
        })
      ).forEach(eligibiliteRefusee => {
        if (!this.isEligibiliteRefusee(refus, eligibiliteRefusee.eligibilite)) {
          refus.push(eligibiliteRefusee);
        }
      });
    }

    if (!demandeur.isMajeur) {
      QuestionUtils.createRefusByPrestation(
        eligibilites, Prestation.AIDE_SOCIALE, eligibilite => ({
          key: `question.prestations.motifRefus.${eligibilite.prestation}_MINEUR`
        })
      ).forEach(eligibiliteRefusee => {
        if (!this.isEligibiliteRefusee(refus, eligibiliteRefusee.eligibilite)) {
          refus.push(eligibiliteRefusee);
        }
      });
    }

    if (demandeur.hasConcubin && !AnswerUtils.hasEnfantEnCommun(formData)) {
      QuestionUtils.createRefusByPrestationAndMembre(
        eligibilites, Prestation.PC_FAM, demandeur.partenaire, eligibilite => ({
          key: `question.prestations.motifRefus.${eligibilite.prestation}_SANS_ENFANTS_COMMUN`,
          parameters: {prenomAutreParent: demandeur.partenaire.prenom}
        })
      ).forEach(eligibiliteRefusee => {
        if (!this.isEligibiliteRefusee(refus, eligibiliteRefusee.eligibilite)) {
          refus.push(eligibiliteRefusee);
        }
      });
    }

    return refus;
  }

  private hasEnfantsMoins25Ans(demandeur: Demandeur) {
    return demandeur.enfants.some(enfant => enfant.age <= 25);
  }

  private isEligibiliteRefusee(refus: EligibiliteRefusee[], eligibilite: Eligibilite) {
    return new EligibiliteGroup(refus.map(refus => refus.eligibilite)).includes(eligibilite);
  }

}
