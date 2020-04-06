import { Injectable } from '@angular/core';
import { QuestionLoader } from '../question-loader';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { Categorie, QeliQuestionDecorator, Subcategorie } from '../qeli-question-decorator.model';
import { Eligibilite, EligibiliteGroup } from '../eligibilite.model';
import { CompositeQuestion } from '../../../dynamic-question/composite-question/composite-question.model';
import { Prestation } from '../../configuration/prestation.model';
import { Relation } from '../../configuration/demandeur.model';
import { RadioQuestion } from '../../../dynamic-question/radio-question/radio-question.model';
import { TypeEnfant } from './type-enfant.model';

@Injectable({
  providedIn: 'root'
})
export class EnfantsQuestionService implements QuestionLoader {

  loadQuestions(configuration: QeliConfiguration, eligibilites: Eligibilite[]): QeliQuestionDecorator<any>[] {
    const eligibiliteGroup = new EligibiliteGroup(eligibilites);
    const enfants = eligibiliteGroup.demandeur.membresFamille.filter(membre => membre.relation === Relation.ENFANT);

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
            radioOptions: Object.keys(TypeEnfant).map(typeEnfant => ({
              value: typeEnfant,
              label: {key: `question.parentsEnfants.option.${typeEnfant}`}
            }))
          })
        }))
      }),
      // TODO Enfants de moins de 25 ans
      skip: () => enfants.length === 0,
      calculateRefus: () => [],
      eligibilites: eligibiliteGroup.findByPrestation(Prestation.PC_FAM),
      categorie: Categorie.SITUATION_PERSONELLE,
      subcategorie: Subcategorie.ETAT_CIVIL
    }];
  }
}
