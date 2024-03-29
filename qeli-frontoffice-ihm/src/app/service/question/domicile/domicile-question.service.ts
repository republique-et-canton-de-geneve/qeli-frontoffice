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
import { Categorie, QeliQuestionDecorator } from '../qeli-question-decorator.model';
import { Eligibilite, EligibiliteGroup, EligibiliteRefusee } from '../eligibilite.model';
import { MembreFoyer, Personne, Relation } from '../../configuration/demandeur.model';
import { RadioQuestion } from '../../../dynamic-question/radio-question/radio-question.model';
import { Prestation } from '../../configuration/prestation.model';
import { REPONSE_PROGRESSIVE_OPTIONS, ReponseProgressive } from '../reponse-binaire.model';
import { DateAnswer, DateQuestion } from '../../../dynamic-question/date-question/date-question.model';
import * as moment from 'moment';
import { FormData } from '../../../dynamic-question/model/question.model';
import { QuestionUtils } from '../qeli-questions.utils';
import { AnswerUtils } from '../answer-utils';
import { TypeEnfant } from '../enfants/type-enfant.model';
import { CompositeQuestion } from '../../../dynamic-question/composite-question/composite-question.model';
import { get } from 'lodash-es';

export class DomicileQuestionService extends QuestionLoader {

  loadQuestions(configuration: QeliConfiguration): QeliQuestionDecorator<any>[] {
    const eligibiliteGroup = new EligibiliteGroup(this.demandeur.toEligibilite(), this.demandeur);
    const membres: Personne[] = [
      this.demandeur,
      this.demandeur.partenaire
    ].filter(membre => membre !== null && membre !== undefined);

    return membres.map((membre): QeliQuestionDecorator<any>[] => {
      const translateParams = {who: membre.id === 0 ? 'me' : 'them', membre: membre.prenom};
      return [{
        question: new CompositeQuestion({
          key: `domicileCantonGE_${membre.id}`,
          dataCyIdentifier: '0501_domicileCantonGE',
          label: {
            key: 'question.domicileCantonGE.title',
            parameters: translateParams
          },
          items: [{
            question: new RadioQuestion({
              key: 'domicileCantonGE',
              dataCyIdentifier: `0501_domicileCantonGE_${membre.id}`,
              label: {
                key: 'question.domicileCantonGE.label',
                parameters: translateParams
              },
              errorLabels: {required: {key: 'question.domicileCantonGE.error.required'}},
              inline: true,
              radioOptions: REPONSE_PROGRESSIVE_OPTIONS
            })
          }, {
            question: new DateQuestion({
              key: 'dateArriveeGeneve',
              dataCyIdentifier: `0502_dateArriveeGeneve_${membre.id}`,
              label: {
                key: 'question.dateArriveeGeneve.label',
                parameters: translateParams
              },
              help: {
                key: 'question.dateArriveeGeneve.help',
                parameters: translateParams
              },
              maxDate: new Date(),
              minDate: moment().subtract(configuration.minYearsFromNow, 'year').toDate(),
              errorLabels: QuestionUtils.toErrorLabels(
                'dateArriveeGeneve',
                ['required', 'maxDate', 'minDate', 'invalidDate'],
                translateParams
              ),
              shortcuts: ['NO_SHORTCUT', 'DEPUIS_NAISSANCE', 'INCONNU'].map(shortcut => ({
                value: shortcut,
                label: {
                  key: `question.dateArriveeGeneve.shortcut.${shortcut}`,
                  parameters: translateParams
                }
              }))
            }),
            isShown: this.isDomicileGEFn(membre)
          }]
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
        calculateRefus: this.calculateDomicileCantonGERefusFn(membre).bind(this),
        eligibilites: eligibiliteGroup.findByPrestation(Prestation.PC_FAM).concat(
          eligibiliteGroup.findByPrestationEtMembre([
            Prestation.AVANCES,
            Prestation.ALLOCATION_LOGEMENT,
            Prestation.AIDE_SOCIALE], membre
          ).concat(eligibiliteGroup.findByPrestation(Prestation.PC_AVS_AI))
        ),
        categorie: Categorie.DOMICILE
      }];
    }).reduce((result, current) => result.concat(current), []);
  }

  private calculateDomicileCantonGERefusFn(membre: Personne) {
    return (formData: FormData, eligibilites: Eligibilite[]): EligibiliteRefusee[] => {
      const eligibiliteGroup = new EligibiliteGroup(eligibilites, this.demandeur);
      const refus: EligibiliteRefusee[] = [];

      if (AnswerUtils.checkOptionAnswer(
        formData,
        `domicileCantonGE_${membre.id}.domicileCantonGE`,
        ReponseProgressive.NON)) {
        const prestationToRefuse = [Prestation.PC_FAM,
                                    Prestation.AVANCES,
                                    Prestation.ALLOCATION_LOGEMENT,
                                    Prestation.AIDE_SOCIALE,
                                    Prestation.PC_AVS_AI];

        QuestionUtils.createRefusByPrestationAndMembre(
          eligibiliteGroup, prestationToRefuse, membre, eligibilite => ({
            key: `question.domicileCantonGE.motifRefus.${eligibilite.prestation}`,
            parameters: {who: membre.id === 0 ? 'me' : 'them', membre: membre.prenom}
          })
        ).forEach(eligibiliteRefusee => refus.push(eligibiliteRefusee));

        const isDemandeurEligiblePcAvsAi = eligibiliteGroup.includes(
          {prestation: Prestation.PC_AVS_AI, membreId: this.demandeur.id}
        );

        eligibiliteGroup.findByPrestationEtRelation(Prestation.PC_AVS_AI, Relation.ENFANT).filter(eligibilite => {
          if (membre.id === this.demandeur.id) {
            return !this.demandeur.partenaire ||
                   (this.demandeur.hasConcubin &&
                    AnswerUtils.isEnfantType(formData, eligibilite.membreId, TypeEnfant.MOI));
          } else if ((membre as MembreFoyer).isConjoint || (membre as MembreFoyer).isConcubin) {
            return !isDemandeurEligiblePcAvsAi;
          }
        }).map((eligibilite) => ({
            eligibilite: eligibilite,
            motif: {
              key: `question.domicileCantonGE.motifRefus.${eligibilite.prestation}_ENFANT`,
              parameters: {membre: this.demandeur.findMembrebyId(eligibilite.membreId).prenom}
            }
          } as EligibiliteRefusee)
        ).forEach(eligibiliteRefusee => refus.push(eligibiliteRefusee));
      } else {
        const dateArriveeGeneveAnswer = AnswerUtils.getDateAnswer(
          formData,
          `domicileCantonGE_${membre.id}.dateArriveeGeneve`
        );
        const isDateArriveeInconnu = this.isDateInconnu(dateArriveeGeneveAnswer);
        const dateArriveeGeneve: Date = this.toDate(dateArriveeGeneveAnswer, membre);
        const eligibiliteGroup = new EligibiliteGroup(eligibilites, this.demandeur);

        // Si la personne habite en Suisse depuis plus de 5 ans (ou elle ne sait pas la date d'arrivée) pas de sortie
        // d'éligibilité.
        if (isDateArriveeInconnu || this.habiteGeneveDepuis(dateArriveeGeneve, 5)) {
          return [];
        } else {
          return QuestionUtils.createRefusByPrestationAndMembre(
            eligibiliteGroup, Prestation.PC_FAM, membre, eligibilite => ({
              key: `question.dateArriveeGeneve.motifRefus.${eligibilite.prestation}`,
              parameters: {who: membre.id === 0 ? 'me' : 'them', membre: membre.prenom}
            })
          );
        }
      }

      return refus;
    };
  }

  private habiteGeneveDepuis(dateArriveeGeneve: Date, years: number) {
    return moment().subtract(years, 'year')
                   .endOf('day')
                   .isAfter(moment(dateArriveeGeneve));
  }

  private isDateInconnu(dateAnswer: DateAnswer) {
    return dateAnswer.shortcut && dateAnswer.shortcut.value === 'INCONNU';
  }

  private toDate(dateAnswer: DateAnswer, membre: Personne) {
    if (dateAnswer.shortcut && dateAnswer.shortcut.value === 'DEPUIS_NAISSANCE') {
      return membre.dateNaissance;
    } else {
      return dateAnswer.value;
    }
  }

  private isDomicileGEFn(membre) {
    return (value) => {
      return get(value, `domicileCantonGE_${membre.id}.domicileCantonGE`) !== ReponseProgressive.NON;
    }
  }
}

