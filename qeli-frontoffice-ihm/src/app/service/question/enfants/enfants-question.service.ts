import { Injectable } from '@angular/core';
import { QuestionLoader } from '../question-loader';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { Categorie, QeliQuestionDecorator, Subcategorie } from '../qeli-question-decorator.model';
import { Eligibilite, EligibiliteGroup, EligibiliteRefusee } from '../eligibilite.model';
import {
  CompositeAnswer, CompositeQuestion
} from '../../../dynamic-question/composite-question/composite-question.model';
import { Prestation } from '../../configuration/prestation.model';
import { MembreFamille, Relation } from '../../configuration/demandeur.model';
import { RadioQuestion } from '../../../dynamic-question/radio-question/radio-question.model';
import { TypeEnfant } from './type-enfant.model';
import { FormData } from '../../../dynamic-question/model/question.model';
import { OptionAnswer } from '../../../dynamic-question/model/answer.model';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class EnfantsQuestionService implements QuestionLoader {

  loadQuestions(configuration: QeliConfiguration, eligibilites: Eligibilite[]): QeliQuestionDecorator<any>[] {
    const eligibiliteGroup = new EligibiliteGroup(eligibilites);
    const enfants = eligibiliteGroup.demandeur.enfants;
    const autreParent = eligibiliteGroup.demandeur.partenaire;

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
            inline: true,
            radioOptions: Object.keys(TypeEnfant).filter(typeEnfant =>
              typeEnfant === TypeEnfant.MOI ||
              typeEnfant === TypeEnfant.AUTRES ||
              (typeEnfant === TypeEnfant.LES_DEUX && autreParent) ||
              (typeEnfant === TypeEnfant.AUTRE_PARENT && autreParent)
            ).map(typeEnfant => ({
              value: typeEnfant,
              label: {
                key: `question.parentsEnfants.option.${typeEnfant}`,
                parameters: typeEnfant === TypeEnfant.AUTRE_PARENT ? {prenomAutreParent: autreParent.prenom} : {}
              }
            }))
          })
        }))
      }),
      skip: () => enfants.filter(enfant => this.isEnfantMoins25Ans(enfant)).length === 0,
      calculateRefus: this.calculateRefus.bind(this),
      eligibilites: eligibiliteGroup.findByPrestationEtRelationIn(
        Prestation.PC_FAM, [Relation.EPOUX, Relation.PARTENAIRE_ENREGISTRE, Relation.CONCUBIN]
      ),
      categorie: Categorie.SITUATION_PERSONELLE,
      subcategorie: Subcategorie.ETAT_CIVIL
    }];
  }

  private isEnfantMoins25Ans(enfant: MembreFamille) {
    return moment().subtract(25, 'year').endOf('day').isBefore(enfant.dateNaissance);
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
      return eligibiliteGroup.findByPrestationEtMembre(Prestation.PC_FAM, concubin).map(eligibilite => ({
        eligibilite: eligibilite,
        motif: {
          key: `question.parentsEnfants.motifRefus.${Prestation.PC_FAM}`,
          parameters: {prenomAutreParent: concubin.prenom}
        }
      } as EligibiliteRefusee));
    }
  }
}
