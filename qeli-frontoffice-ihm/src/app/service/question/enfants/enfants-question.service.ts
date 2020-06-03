import { QuestionLoader } from '../question-loader';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { Categorie, QeliQuestionDecorator, Subcategorie } from '../qeli-question-decorator.model';
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
        categorie: Categorie.SITUATION_PERSONELLE,
        subcategorie: Subcategorie.ETAT_CIVIL
      }];
    }
  }
}
