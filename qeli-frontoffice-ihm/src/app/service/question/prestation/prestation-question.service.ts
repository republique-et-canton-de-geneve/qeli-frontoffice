/*
 * qeli-frontoffice
 *
 * Copyright (C) 2019-2021 Republique et canton de Geneve
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { QuestionLoader } from '../question-loader';
import {
  CheckboxGroup, CheckboxGroupAnswer, CheckboxGroupQuestion
} from '../../../dynamic-question/checkbox-group-question/checkbox-group-question.model';
import { Prestation } from '../../configuration/prestation.model';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { FormData, QuestionOption } from '../../../dynamic-question/model/question.model';
import { Eligibilite, EligibiliteGroup, EligibiliteRefusee } from '../eligibilite.model';
import { Categorie, QeliQuestionDecorator } from '../qeli-question-decorator.model';
import { Relation } from '../../configuration/demandeur.model';
import { QuestionUtils } from '../qeli-questions.utils';
import { AnswerUtils } from '../answer-utils';
import { TypeEnfant } from '../enfants/type-enfant.model';

export class PrestationQuestionService extends QuestionLoader {

  loadQuestions(configuration: QeliConfiguration): QeliQuestionDecorator<any>[] {
    const eligibiliteAsGroup = new EligibiliteGroup(this.demandeur.toEligibilite(), this.demandeur);
    return [
      {
        question: new CheckboxGroupQuestion({
          key: 'prestations',
          dataCyIdentifier: '0101_prestations',
          label: {
            key: 'question.prestations.label',
            parameters: {numberOfMemebres: this.demandeur.membresFamille.length}
          },
          errorLabels: QuestionUtils.toErrorLabels('prestations', ['required', 'atLeastOneSelected']),
          help: {key: 'question.prestations.help'},
          extraHelp: {key: 'question.prestations.extraHelp'},
          hasSomeOptions: [
            {
              value: 'OUI',
              label: {
                key: 'question.prestations.some',
                parameters: {numberOfMemebres: this.demandeur.membresFamille.length}
              }
            },
            {
              value: 'NON',
              label: {
                key: 'question.prestations.none',
                parameters: {numberOfMemebres: this.demandeur.membresFamille.length}
              }
            },
            {value: 'INCONNU', label: {key: 'question.prestations.inconnu'}}
          ],
          checkboxOptions: Object.keys(Prestation).map(prestation => {
            if (prestation === Prestation.SUBSIDES || prestation === Prestation.BOURSES) {
              const checkBoxGroupOptions = eligibiliteAsGroup.findByPrestation(prestation).map(eligibilite => ({
                value: `${prestation}_${eligibilite.membreId}`,
                label: {
                  key: `question.prestations.option.${prestation}`,
                  parameters: {
                    who: eligibilite.membreId === 0 ? 'me' : 'them',
                    membre: this.demandeur.findMembrebyId(eligibilite.membreId).prenom,
                    numberOfMemebres: this.demandeur.membresFamille.length
                  }
                }
              })) as QuestionOption<string>[];

              return (this.demandeur.membresFamille.length > 0) ? [{
                label: {key: `question.prestations.checkboxGroup.${prestation}`},
                options: checkBoxGroupOptions
              }] as CheckboxGroup[] : checkBoxGroupOptions;
            }
            return [{
              value: prestation, label: {key: `question.prestations.option.${prestation}`}
            }] as QuestionOption<string>[];
          }).reduce((result, current) => result.concat(current), [] as (QuestionOption<string> | CheckboxGroup)[])
        }),
        eligibilites: this.demandeur.toEligibilite(),
        calculateRefus: this.calculateRefus.bind(this),
        categorie: Categorie.PRESTATION
      }
    ];
  }

  private calculateRefus(formData: FormData, eligibilites: Eligibilite[]) {
    const refus: EligibiliteRefusee[] = [];
    const prestationsAnswer = formData['prestations'] as CheckboxGroupAnswer;
    const eligibiliteToMotif = eligibilite => ({key: `question.prestations.motifRefus.${eligibilite.prestation}`});
    const eligibiliteGroup = new EligibiliteGroup(eligibilites, this.demandeur);

    if (prestationsAnswer.hasSome.value === 'OUI') {
      const choices = prestationsAnswer.choices;

      // Création des refus pour les prestations cochées (c'est-à-dire déjà perçues).
      eligibilites.map(eligibilite => {
        const prestation = eligibilite.prestation;

        if (prestation === Prestation.SUBSIDES || prestation === Prestation.BOURSES) {
          if (choices.some(choice => choice.value === `${prestation}_${eligibilite.membreId}`)) {
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
          eligibiliteGroup,
          [Prestation.SUBSIDES, Prestation.ALLOCATION_LOGEMENT, Prestation.PC_FAM],
          eligibiliteToMotif
        ).forEach(eligibiliteRefusee => {
          if (!this.isEligibiliteRefusee(refus, eligibiliteRefusee.eligibilite)) {
            refus.push(eligibiliteRefusee);
          }
        });
      }

      if (choices.some(choice => choice.value === Prestation.PC_FAM)) {
        QuestionUtils.createRefusByPrestation(
          eligibiliteGroup, [Prestation.SUBSIDES, Prestation.PC_AVS_AI], eligibiliteToMotif
        ).forEach(eligibiliteRefusee => {
          if (!this.isEligibiliteRefusee(refus, eligibiliteRefusee.eligibilite)) {
            refus.push(eligibiliteRefusee);
          }
        });
      }

      if (choices.some(choice => choice.value === Prestation.AIDE_SOCIALE)) {
        QuestionUtils.createRefusByPrestation(
          eligibiliteGroup, Prestation.SUBSIDES, eligibiliteToMotif
        ).forEach(eligibiliteRefusee => {
          if (!this.isEligibiliteRefusee(refus, eligibiliteRefusee.eligibilite)) {
            refus.push(eligibiliteRefusee);
          }
        });
      }

      if (choices.some(choice => choice.value === Prestation.SUBVENTION_HM)) {
        QuestionUtils.createRefusByPrestation(
          eligibiliteGroup, Prestation.ALLOCATION_LOGEMENT, eligibiliteToMotif
        ).forEach(eligibiliteRefusee => {
          if (!this.isEligibiliteRefusee(refus, eligibiliteRefusee.eligibilite)) {
            refus.push(eligibiliteRefusee);
          }
        });
      }
    }

    // Refus PC AVS AI pour les enfants 'AUTRES'
    eligibiliteGroup.findByPrestationEtRelation(Prestation.PC_AVS_AI, Relation.ENFANT).filter(
      eligibilite => AnswerUtils.isEnfantType(formData, eligibilite.membreId, TypeEnfant.AUTRES)
    ).map((eligibilite) => ({
        eligibilite: eligibilite,
        motif: {
          key: `question.prestations.motifRefus.${eligibilite.prestation}_ENFANT_AUTRE`,
          parameters: {prenomEnfant: this.demandeur.findMembrebyId(eligibilite.membreId).prenom}
        }
      } as EligibiliteRefusee)
    ).forEach(eligibiliteRefusee => {
      if (!this.isEligibiliteRefusee(refus, eligibiliteRefusee.eligibilite)) {
        refus.push(eligibiliteRefusee);
      }
    });

    if (!this.hasEnfantsMoins25Ans()) {
      QuestionUtils.createRefusByPrestation(
        eligibiliteGroup, Prestation.PC_FAM, eligibilite => ({
          key: `question.prestations.motifRefus.${eligibilite.prestation}_SANS_ENFANTS`
        })
      ).forEach(eligibiliteRefusee => {
        if (!this.isEligibiliteRefusee(refus, eligibiliteRefusee.eligibilite)) {
          refus.push(eligibiliteRefusee);
        }
      });
    }

    if (!this.demandeur.isMajeur) {
      QuestionUtils.createRefusByPrestation(
        eligibiliteGroup, Prestation.AIDE_SOCIALE, eligibilite => ({
          key: `question.prestations.motifRefus.${eligibilite.prestation}_MINEUR`
        })
      ).forEach(eligibiliteRefusee => {
        if (!this.isEligibiliteRefusee(refus, eligibiliteRefusee.eligibilite)) {
          refus.push(eligibiliteRefusee);
        }
      });
    }

    if (this.demandeur.hasConcubin && !AnswerUtils.hasEnfantEnCommun(formData)) {
      QuestionUtils.createRefusByPrestationAndMembre(
        eligibiliteGroup, Prestation.PC_FAM, this.demandeur.partenaire, eligibilite => ({
          key: `question.prestations.motifRefus.${eligibilite.prestation}_SANS_ENFANTS_COMMUN`,
          parameters: {prenomAutreParent: this.demandeur.partenaire.prenom}
        })
      ).forEach(eligibiliteRefusee => {
        if (!this.isEligibiliteRefusee(refus, eligibiliteRefusee.eligibilite)) {
          refus.push(eligibiliteRefusee);
        }
      });
    }

    return refus;
  }

  private hasEnfantsMoins25Ans() {
    return this.demandeur.enfants.some(enfant => enfant.age <= 25);
  }

  private isEligibiliteRefusee(refus: EligibiliteRefusee[], eligibilite: Eligibilite) {
    return new EligibiliteGroup(refus.map(refus => refus.eligibilite), this.demandeur).includes(eligibilite);
  }
}
