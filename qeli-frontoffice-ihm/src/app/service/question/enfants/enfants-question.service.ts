import { Injectable } from '@angular/core';
import { QuestionLoader, QuestionUtils } from '../question-loader';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { Categorie, QeliQuestionDecorator, Subcategorie } from '../qeli-question-decorator.model';
import { Eligibilite, EligibiliteGroup } from '../eligibilite.model';
import {
  CompositeAnswer, CompositeQuestion
} from '../../../dynamic-question/composite-question/composite-question.model';
import { Prestation } from '../../configuration/prestation.model';
import { Relation } from '../../configuration/demandeur.model';
import { RadioQuestion } from '../../../dynamic-question/radio-question/radio-question.model';
import { TypeEnfant, typeEnfantAsOptions } from './type-enfant.model';
import { FormData } from '../../../dynamic-question/model/question.model';
import { OptionAnswer } from '../../../dynamic-question/model/answer.model';

@Injectable({
  providedIn: 'root'
})
export class EnfantsQuestionService implements QuestionLoader {

  loadQuestions(configuration: QeliConfiguration, eligibilites: Eligibilite[]): QeliQuestionDecorator<any>[] {
    const eligibiliteGroup = new EligibiliteGroup(eligibilites);
    const enfants = eligibiliteGroup.demandeur.enfants;
    const autreParent = eligibiliteGroup.demandeur.partenaire;

    if (enfants.length === 0 || !autreParent) {
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
        skip: () => !enfants.some(enfant => enfant.age <= 25),
        calculateRefus: this.calculateRefus.bind(this),
        eligibilites: eligibilites,
        categorie: Categorie.SITUATION_PERSONELLE,
        subcategorie: Subcategorie.ETAT_CIVIL
      }];
    }
  }

  private calculateRefus(formData: FormData, eligibilites: Eligibilite[]) {
    const eligibiliteGroup = new EligibiliteGroup(eligibilites);
    const concubin = eligibiliteGroup.demandeur.membresFamille.find(membre => membre.relation === Relation.CONCUBIN);
    const answers = (formData['parentsEnfants'] as CompositeAnswer).answers;
    const hasEnfantToutLesDeux = Object.values(answers).some(answer => {
      const option = (answer as OptionAnswer<string>).value;
      return option.value === TypeEnfant.LES_DEUX;
    });

    if (!concubin || hasEnfantToutLesDeux) {
      return [];
    } else {
      // TODO Attention dans l'écran de résultat si on coche 'déjà péçue` dans la prochaine question PC FAM apparaît
      //  quand-même refusée alors qu'elle ne devrait pas. Il faudrait bouger ce check.
      return QuestionUtils.createRefusByPrestationAndMembre(
        eligibilites, Prestation.PC_FAM, concubin, eligibilite => ({
          key: `question.parentsEnfants.motifRefus.${eligibilite.prestation}`,
          parameters: {prenomAutreParent: concubin.prenom}
        })
      );
    }
  }
}
