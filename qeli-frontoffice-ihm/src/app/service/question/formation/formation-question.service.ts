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
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { Categorie, QeliQuestionDecorator, RefusEligibiliteFn } from '../qeli-question-decorator.model';
import { Eligibilite, EligibiliteGroup, EligibiliteRefusee } from '../eligibilite.model';
import { Personne, Relation } from '../../configuration/demandeur.model';
import { Prestation } from '../../configuration/prestation.model';
import { RadioQuestion } from '../../../dynamic-question/radio-question/radio-question.model';
import { REPONSE_BINAIRE_OPTIONS } from '../reponse-binaire.model';
import { Scolarite, typeScolariteOptions } from './scolarite.model';
import { FormData } from '../../../dynamic-question/model/question.model';
import { CompositeQuestion } from '../../../dynamic-question/composite-question/composite-question.model';
import { AnswerUtils } from '../answer-utils';
import { QuestionUtils } from '../qeli-questions.utils';
import { DropdownAnswer, DropdownQuestion } from '../../../dynamic-question/dropdown-question/dropdown-question.model';

export const SORTIES_ELIGIBILITE_BOURSES = [
  Scolarite.SCOLARITE_OBLIGATOIRE_1P_A_10P,
  Scolarite.SCOLARITE_OBLIGATOIRE_11P,
  Scolarite.UNIVERSITE_DOCTORAT,
  Scolarite.FORMATION_CONTINUE_CERTIFIANTE,
  Scolarite.FORMATION_CONTINUE_COURTE
];

export class FormationQuestionService extends QuestionLoader {

  loadQuestions(configuration: QeliConfiguration): QeliQuestionDecorator<any>[] {
    const eligibiliteGroup = new EligibiliteGroup(this.demandeur.toEligibilite(), this.demandeur);
    const membres = ([this.demandeur] as (Personne)[]).concat(this.demandeur.membresFamille);
    const questions: QeliQuestionDecorator<any>[] = [];

    questions.push({
      question: new CompositeQuestion({
        key: 'formation',
        dataCyIdentifier: '0702_formation',
        label: {
          key: 'question.formation.label',
          parameters: {numberOfMemebres: this.demandeur.membresFamille.length}
        },
        help: {key: 'question.formation.help'},
        extraHelp: {key: 'question.formation.extraHelp'},
        showErrors: false,
        items: membres.map(membre => ({
          question: new RadioQuestion({
            key: `formation_${membre.id}`,
            dataCyIdentifier: `0702_formation_${membre.id}`,
            label: {
              key: 'question.formation.membre',
              parameters: {who: membre.id === 0 ? 'me' : 'them', membre: membre.prenom}
            },
            errorLabels: QuestionUtils.toErrorLabels(`formation`, ['required']),
            inline: true,
            radioOptions: REPONSE_BINAIRE_OPTIONS
          })
        }))
      }),
      calculateRefus: this.calculateFormationRefusFn.bind(this),
      eligibilites: eligibiliteGroup.findByPrestation([Prestation.BOURSES, Prestation.PC_FAM]).concat(
        eligibiliteGroup.findByPrestationEtRelation(Prestation.PC_AVS_AI, Relation.ENFANT)
      ),
      categorie: Categorie.FORMATION
    });

    membres.map((membre): QeliQuestionDecorator<any> => {
      const translateParams = {
        who: membre.id === 0 ? 'me' : 'them',
        membre: membre.prenom
      };

      return {
        question: new DropdownQuestion({
          key: `scolarite_${membre.id}`,
          dataCyIdentifier: `0701_scolarite_${membre.id}`,
          label: {key: 'question.scolarite.label', parameters: translateParams},
          errorLabels: {required: {key: 'question.scolarite.error.required'}},
          someOptions: [
            {
              value: 'OUI',
              label: {
                key: 'question.scolarite.typeScolarite.label',
                parameters: translateParams
              }
            },
            {value: 'INCONNU', label: {key: 'question.scolarite.typeScolarite.inconnu'}}
          ],
          dropdownOptions: typeScolariteOptions()
        }),
        calculateRefus: this.calculateScolariteRefusFn(membre).bind(this),
        eligibilites: eligibiliteGroup.findByPrestationEtMembre(Prestation.BOURSES, membre),
        categorie: Categorie.FORMATION
      } as QeliQuestionDecorator<any>;
    }).forEach(question => questions.push(question));

    return questions;
  }

  calculateFormationRefusFn(formData: FormData, eligibilites: Eligibilite[]): EligibiliteRefusee[] {
    const eligibiliteGroup = new EligibiliteGroup(eligibilites, this.demandeur);
    const refus: EligibiliteRefusee[] = [];

    // Si pas d'enfant à charge, refus PC FAM
    if (!AnswerUtils.hasEnfantACharge(formData, this.demandeur)) {
      QuestionUtils.createRefusByPrestation(
        eligibiliteGroup, Prestation.PC_FAM, eligibilite => ({
          key: `question.formation.motifRefus.${eligibilite.prestation}`
        })
      ).forEach(eligibiliteRefusee => refus.push(eligibiliteRefusee));
    }

    // Refus de BOURSES pour les membre qui ne sont pas en formation
    eligibiliteGroup.findByPrestation(Prestation.BOURSES).filter(eligibilite => {
      return !AnswerUtils.isEnFormation(formData, eligibilite.membreId);
    }).map((eligibilite) => ({
        eligibilite: eligibilite,
        motif: {
          key: `question.formation.motifRefus.${eligibilite.prestation}`,
          parameters: {
            who: eligibilite.membreId === 0 ? 'me' : 'them',
            membre: this.demandeur.findMembrebyId(eligibilite.membreId).prenom
          }
        }
      } as EligibiliteRefusee)
    ).forEach(eligibiliteRefusee => refus.push(eligibiliteRefusee));

    // Refus PC AVS AI pour les enfants qui ne sont pas à charge
    eligibiliteGroup.findByPrestationEtRelation(Prestation.PC_AVS_AI, Relation.ENFANT).filter(
      eligibilite =>
        !AnswerUtils.isEnfantACharge(
          formData,
          this.demandeur.findMembrebyId(eligibilite.membreId),
          this.demandeur
        )
    ).map((eligibilite) => ({
        eligibilite: eligibilite,
        motif: {
          key: `question.formation.motifRefus.${eligibilite.prestation}`,
          parameters: {membre: this.demandeur.findMembrebyId(eligibilite.membreId).prenom}
        }
      } as EligibiliteRefusee)
    ).forEach(eligibiliteRefusee => refus.push(eligibiliteRefusee));

    return refus;
  }

  private calculateScolariteRefusFn(membre: Personne): RefusEligibiliteFn {
    return (formData: FormData, eligibilites: Eligibilite[]) => {
      const answer = formData[`scolarite_${membre.id}`] as DropdownAnswer;

      if (answer.hasSome.value === 'OUI' && SORTIES_ELIGIBILITE_BOURSES.includes(Scolarite[answer.value.value])) {
        return QuestionUtils.createRefusByPrestationAndMembre(
          new EligibiliteGroup(eligibilites, this.demandeur),
          Prestation.BOURSES,
          membre,
          () => ({
            key: `question.scolarite.motifRefus.${Prestation.BOURSES}`,
            parameters: {who: membre.id === 0 ? 'me' : 'them', membre: membre.prenom}
          })
        );
      } else {
        return [];
      }
    };
  }
}
