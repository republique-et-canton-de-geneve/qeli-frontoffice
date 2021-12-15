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
import { CompositeQuestion } from '../../../dynamic-question/composite-question/composite-question.model';
import { RadioQuestion } from '../../../dynamic-question/radio-question/radio-question.model';
import { typeEnfantAsOptions } from './type-enfant.model';

export class EnfantsQuestionService extends QuestionLoader {

  loadQuestions(configuration: QeliConfiguration): QeliQuestionDecorator<any>[] {
    const enfants = this.demandeur.enfants;
    const autreParent = this.demandeur.partenaire;

    if (enfants.length === 0) {
      return [];
    } else {
      return [{
        question: new CompositeQuestion({
          key: 'parentsEnfants',
          dataCyIdentifier: '0506_parentsEnfants',
          label: {key: 'question.parentsEnfants.label'},
          help: {key: 'question.parentsEnfants.help'},
          showErrors: false,
          items: enfants.map(enfant => ({
            question: new RadioQuestion({
              key: `parentsEnfants_${enfant.id}`,
              dataCyIdentifier: `0506_parentsEnfants_${enfant.id}`,
              label: {
                key: 'question.parentsEnfants.membre',
                parameters: {membre: enfant.prenom}
              },
              errorLabels: {required: {key: 'question.parentsEnfants.error.required'}},
              inline: true,
              radioOptions: typeEnfantAsOptions(autreParent)
            })
          }))
        }),
        calculateRefus: () => [],
        eligibilites: this.demandeur.toEligibilite(),
        categorie: Categorie.ETAT_CIVIL
      }];
    }
  }
}
