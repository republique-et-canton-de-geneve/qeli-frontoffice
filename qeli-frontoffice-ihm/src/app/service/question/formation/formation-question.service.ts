import { Injectable } from '@angular/core';
import { QuestionLoader } from '../question-loader';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { Categorie, QeliQuestionDecorator, RefusEligibiliteFn, Subcategorie } from '../qeli-question-decorator.model';
import { Eligibilite, EligibiliteGroup, EligibiliteRefusee } from '../eligibilite.model';
import { Prestation } from '../../configuration/prestation.model';
import { RadioQuestion } from '../../../dynamic-question/radio-question/radio-question.model';
import { Scolarite, scolariteToOption } from './scolarite.model';
import { Demandeur, MembreFamille } from '../../configuration/demandeur.model';
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
      }),
      new RadioQuestion({
        key: 'permisBEtudes',
        code: '0405',
        categorie: Categorie.SITUATION_PERSONELLE,
        subcategorie: Subcategorie.NATIONALITE,
        help: true,
        inline: true,
        options: Object.keys(ReponseProgressive).map(label => ({label: label})),
        skip: (value: any) => isSuisse(value) ||
                              isRefugie(value) ||
                              isRequerantAsile(value) ||
                              isApatride(value),
        eligibilite: [
          {prestation: Prestation.BOURSES}
        ]
      }),*/
    const eligibiliteGroup = new EligibiliteGroup(eligibilites);
    const membres: (Demandeur | MembreFamille)[] = (
      [eligibiliteGroup.demandeur] as (MembreFamille | Demandeur)[]
    ).concat(eligibiliteGroup.demandeur.membresFamille);

    return membres.map(membre => {
      const translateParams = {who: membre.id === 0 ? 'me' : 'them', membre: membre.prenom};
      return {
        question: new RadioQuestion({
          key: `scolarite_${membre.id}`,
          dataCyIdentifier: `0701_scolarite_${membre.id}`,
          label: {key: 'question.scolarite.label', parameters: translateParams},
          errorLabels: {
            required: {key: 'question.scolarite.error.required'}
          },
          radioOptions: Object.keys(Scolarite).map(scolariteToOption)
        }),
        calculateRefus: this.calculateRefusFn(membre),
        eligibilites: eligibiliteGroup.findByPrestationEtMembre(Prestation.BOURSES, membre),
        categorie: Categorie.COMPLEMENTS,
        subcategorie: Subcategorie.FORMATION
      };
    });
  }

  private calculateRefusFn(membre: MembreFamille | Demandeur): RefusEligibiliteFn {
    return (formData: FormData, eligibilites: Eligibilite[]) => {
      const answer = (formData[`scolarite_${membre.id}`] as OptionAnswer<string>).value;

      if (answer.value === Scolarite.AUCUNE ||
          answer.value === Scolarite.INCONNU) {
        return [];
      } else {
        return new EligibiliteGroup(eligibilites).findByPrestationEtMembre(Prestation.BOURSES, membre).map(
          eligibilite => ({
            eligibilite: eligibilite,
            motif: {
              key: `question.scolarite.motifRefus.${Prestation.BOURSES}`,
              parameters: {who: membre.id === 0 ? 'me' : 'them', membre: membre.prenom}
            }
          } as EligibiliteRefusee)
        );
      }
    };
  }
}
