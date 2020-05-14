import { Injectable } from '@angular/core';
import { QuestionLoader } from '../question-loader';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { Categorie, QeliQuestionDecorator, RefusEligibiliteFn, Subcategorie } from '../qeli-question-decorator.model';
import { Eligibilite, EligibiliteGroup, EligibiliteRefusee } from '../eligibilite.model';
import {
  CompositeAnswer, CompositeQuestion
} from '../../../dynamic-question/composite-question/composite-question.model';
import { RadioQuestion } from '../../../dynamic-question/radio-question/radio-question.model';
import { TypeEnfant, typeEnfantAsOptions } from './type-enfant.model';
import { FormData } from '../../../dynamic-question/model/question.model';
import { Personne, Relation } from '../../configuration/demandeur.model';
import { OptionAnswer } from '../../../dynamic-question/model/answer.model';
import { Scolarite } from '../formation/scolarite.model';
import { QuestionUtils } from '../qeli-questions.utils';
import { Prestation } from '../../configuration/prestation.model';
import { AnswerUtils } from '../answer-utils';

@Injectable({
  providedIn: 'root'
})
export class EnfantsQuestionService implements QuestionLoader {

  loadQuestions(configuration: QeliConfiguration, eligibilites: Eligibilite[]): QeliQuestionDecorator<any>[] {
    const eligibiliteGroup = new EligibiliteGroup(eligibilites);
    const enfants = eligibiliteGroup.demandeur.enfants;
    const autreParent = eligibiliteGroup.demandeur.partenaire;

    if (enfants.length === 0) {
      return [];
    } else {
      return [{
        question: new CompositeQuestion({
          key: 'parentsEnfants',
          dataCyIdentifier: '0506_parentsEnfants',
          label: {key: 'question.parentsEnfants.label'},
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
        calculateRefus: this.calculateRefusFn ,
        eligibilites: eligibilites,
        categorie: Categorie.SITUATION_PERSONELLE,
        subcategorie: Subcategorie.ETAT_CIVIL
      }];
    }
  }

  private calculateRefusFn(formData: FormData, eligibilites: Eligibilite[]) {
    const eligibiliteGroup = new EligibiliteGroup(eligibilites);
    const refus: EligibiliteRefusee[] = [];

    // Refus PC AVS AI pour les enfants qui ne sont pas à charge
    eligibiliteGroup.findByPrestationEtRelation(Prestation.PC_AVS_AI, Relation.ENFANT).filter(eligibilite => {
      const answers = (formData['parentsEnfants'] as CompositeAnswer).answers;
      const option = (answers[`parentsEnfants_${eligibilite.membre.id}`] as OptionAnswer<string>).value;
      return option.value === TypeEnfant.AUTRES;
    }).map((eligibilite) => ({
        eligibilite: eligibilite,
        motif: {
          key: `question.parentsEnfants.motifRefus.${eligibilite.prestation}`,
          parameters: {membre: eligibilite.membre.prenom}
        }
      } as EligibiliteRefusee)
    ).forEach(eligibiliteRefusee => refus.push(eligibiliteRefusee));

    return refus;
  };

}
