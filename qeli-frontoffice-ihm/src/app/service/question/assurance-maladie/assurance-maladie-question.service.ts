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
import {
  CompositeAnswer, CompositeQuestion
} from '../../../dynamic-question/composite-question/composite-question.model';
import { RadioQuestion } from '../../../dynamic-question/radio-question/radio-question.model';
import { Prestation } from '../../configuration/prestation.model';
import { Personne } from '../../configuration/demandeur.model';
import { REPONSE_PROGRESSIVE_OPTIONS, ReponseProgressive } from '../reponse-binaire.model';
import { FormData } from '../../../dynamic-question/model/question.model';
import { OptionAnswer } from '../../../dynamic-question/model/answer.model';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

export class AssuranceMaladieQuestionService extends QuestionLoader {

  loadQuestions(configuration: QeliConfiguration): QeliQuestionDecorator<any>[] {
    const eligibiliteGroup = new EligibiliteGroup(this.demandeur.toEligibilite(), this.demandeur);
    const membres: Personne[] = (
      [this.demandeur] as Personne[]
    ).concat(this.demandeur.membresFamille);

    return [{
      question: new CompositeQuestion({
        key: 'assuranceMaladieSuisse',
        dataCyIdentifier: '1101_assuranceMaladieSuisse',
        label: {
          key: 'question.assuranceMaladieSuisse.label',
          parameters: {numberOfMemebres: this.demandeur.membresFamille.length}
        },
        help: {key: 'question.assuranceMaladieSuisse.help'},
        extraHelp: {key: 'question.assuranceMaladieSuisse.extraHelp'},
        showErrors: false,
        onValueChanged: (form: UntypedFormGroup) => {
          const assuranceMalaieFormGroup = form.controls['assuranceMaladieSuisse'] as UntypedFormGroup;
          const assuranceMaladieDemandeur = assuranceMalaieFormGroup.controls[`assuranceMaladieSuisse_${this.demandeur.id}`].value;
          this.demandeur.membresFamille.forEach(membre => {
            const formControl = assuranceMalaieFormGroup.controls[`assuranceMaladieSuisse_${membre.id}`] as UntypedFormControl;
            if (formControl.pristine) {
              formControl.setValue(assuranceMaladieDemandeur, {emitEvent: false});
            }
          });
        },
        items: membres.map(membre => ({
          question: new RadioQuestion({
            key: `assuranceMaladieSuisse_${membre.id}`,
            dataCyIdentifier: `1101_assuranceMaladieSuisse_${membre.id}`,
            label: {
              key: 'question.assuranceMaladieSuisse.membre',
              parameters: {
                who: membre.id === 0 ? 'me' : 'them',
                membre: membre.prenom
              }
            },
            errorLabels: {required: {key: 'question.assuranceMaladieSuisse.error.required'}},
            inline: true,
            radioOptions: REPONSE_PROGRESSIVE_OPTIONS
          }),
          isShown: this.hasNotSubsidesFn(membre)
        }))
      }),
      calculateRefus: this.calculateRefus.bind(this),
      eligibilites: eligibiliteGroup.findByPrestation(Prestation.SUBSIDES),
      categorie: Categorie.ASSURANCE_MALADIE
    }];
  }

  private hasNotSubsidesFn(membre: Personne) {
    return (value: any) => {
      const prestation = value['prestations'];
      const choices = prestation['choices'] || [];
      return !choices.includes(`SUBSIDES_${membre.id}`);
    }
  };

  private calculateRefus(formData: FormData, eligibilites: Eligibilite[]): EligibiliteRefusee[] {
    const answers = (formData['assuranceMaladieSuisse'] as CompositeAnswer).answers;
    const eligibiliteGroup = new EligibiliteGroup(eligibilites, this.demandeur);

    return eligibiliteGroup.findByPrestation(Prestation.SUBSIDES).filter(eligibilite => {
      const answer = (answers[`assuranceMaladieSuisse_${eligibilite.membreId}`] as OptionAnswer<string>);
      const choice = answer ? answer.value : null;

      return choice && choice.value === ReponseProgressive.NON;
    }).map(eligibilite => ({
      eligibilite: eligibilite,
      motif: {
        key: `question.assuranceMaladieSuisse.motifRefus.${Prestation.SUBSIDES}`,
        parameters: {
          who: eligibilite.membreId === 0 ? 'me' : 'them',
          membre: this.demandeur.findMembrebyId(eligibilite.membreId).prenom
        }
      }
    }));

  }
}
