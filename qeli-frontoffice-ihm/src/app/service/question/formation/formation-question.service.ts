import { Injectable } from '@angular/core';
import { QuestionLoader, QuestionUtils } from '../question-loader';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { Categorie, QeliQuestionDecorator, RefusEligibiliteFn, Subcategorie } from '../qeli-question-decorator.model';
import { Eligibilite, EligibiliteGroup } from '../eligibilite.model';
import { Prestation } from '../../configuration/prestation.model';
import { RadioQuestion } from '../../../dynamic-question/radio-question/radio-question.model';
import { Scolarite, SCOLARITE_OPTIONS } from './scolarite.model';
import { Personne } from '../../configuration/demandeur.model';
import { FormData } from '../../../dynamic-question/model/question.model';
import { OptionAnswer } from '../../../dynamic-question/model/answer.model';

@Injectable({
  providedIn: 'root'
})
export class FormationQuestionService implements QuestionLoader {

  loadQuestions(configuration: QeliConfiguration, eligibilites: Eligibilite[]): QeliQuestionDecorator<any>[] {
    /*
      new RadioQuestion({
        key: 'enFormation',
        code: '0702',
        inline: true,
        categorie: Categorie.COMPLEMENTS,
        subcategorie: Subcategorie.FORMATION,
        options: Object.keys(ReponseBinaire).map(label => ({label: label})),
        eligibilite: [
          {
            prestation: Prestation.BOURSES,
            isEligible: (value: any) => value['enFormation'] === ReponseBinaire.OUI
          }
        ]
      })*/
    const eligibiliteGroup = new EligibiliteGroup(eligibilites);
    const membres: Personne[] = (
      [eligibiliteGroup.demandeur] as Personne[]
    ).concat(eligibiliteGroup.demandeur.membresFamille);

    return membres.map(membre => {
      const translateParams = {who: membre.id === 0 ? 'me' : 'them', membre: membre.prenom};
      return {
        question: new RadioQuestion({
          key: `scolarite_${membre.id}`,
          dataCyIdentifier: `0701_scolarite_${membre.id}`,
          label: {key: 'question.scolarite.label', parameters: translateParams},
          errorLabels: {required: {key: 'question.scolarite.error.required'}},
          radioOptions: SCOLARITE_OPTIONS
        }),
        calculateRefus: this.calculateRefusFn(membre),
        eligibilites: eligibiliteGroup.findByPrestationEtMembre(Prestation.BOURSES, membre),
        categorie: Categorie.COMPLEMENTS,
        subcategorie: Subcategorie.FORMATION
      };
    });
  }

  private calculateRefusFn(membre: Personne): RefusEligibiliteFn {
    return (formData: FormData, eligibilites: Eligibilite[]) => {
      const answer = (formData[`scolarite_${membre.id}`] as OptionAnswer<string>).value;

      if (answer.value === Scolarite.AUCUNE ||
          answer.value === Scolarite.INCONNU) {
        return [];
      } else {
        return QuestionUtils.createRefusByPrestationAndMembre(
          eligibilites, Prestation.BOURSES, membre, eligibilite => ({
            key: `question.scolarite.motifRefus.${Prestation.BOURSES}`,
            parameters: {who: membre.id === 0 ? 'me' : 'them', membre: membre.prenom}
          })
        );
      }
    };
  }
}
