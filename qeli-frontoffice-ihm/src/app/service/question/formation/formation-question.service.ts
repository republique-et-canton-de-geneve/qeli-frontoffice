import { Injectable } from '@angular/core';
import { QuestionLoader, QuestionUtils } from '../question-loader';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { Categorie, QeliQuestionDecorator, RefusEligibiliteFn, Subcategorie } from '../qeli-question-decorator.model';
import { Eligibilite, EligibiliteGroup, EligibiliteRefusee } from '../eligibilite.model';
import { Demandeur, MembreFamille, Personne, Relation } from '../../configuration/demandeur.model';
import { Prestation } from '../../configuration/prestation.model';
import { RadioQuestion } from '../../../dynamic-question/radio-question/radio-question.model';
import { REPONSE_PROGRESSIVE_OPTIONS, ReponseProgressive } from '../reponse-binaire.model';
import { Scolarite, SCOLARITE_OPTIONS } from './scolarite.model';
import { OptionAnswer } from '../../../dynamic-question/model/answer.model';
import { FormData, QuestionOption } from '../../../dynamic-question/model/question.model';
import {
  CompositeAnswer, CompositeQuestion
} from '../../../dynamic-question/composite-question/composite-question.model';

@Injectable({
  providedIn: 'root'
})
export class FormationQuestionService implements QuestionLoader {

  loadQuestions(configuration: QeliConfiguration, eligibilites: Eligibilite[]): QeliQuestionDecorator<any>[] {

     const eligibiliteGroup = new EligibiliteGroup(eligibilites);
     const membres = ([eligibiliteGroup.demandeur] as (MembreFamille | Demandeur)[]).concat(
      eligibiliteGroup.demandeur.membresFamille
    );

     const res =  membres.map((membre): QeliQuestionDecorator<any>[] => {
      const translateParams = {who: membre.id === 0 ? 'me' : 'them', membre: membre.prenom};
      return [
        {
          question: new RadioQuestion({
            key: `scolarite_${membre.id}`,
            dataCyIdentifier: `0701_scolarite_${membre.id}`,
            label: {key: 'question.scolarite.label', parameters: translateParams},
            errorLabels: {required: {key: 'question.scolarite.error.required'}},
            radioOptions: SCOLARITE_OPTIONS
          }),
          calculateRefus: this.calculateScolariteRefusFn(membre),
          eligibilites: eligibiliteGroup.findByPrestationEtMembre(Prestation.BOURSES, membre),
          categorie: Categorie.COMPLEMENTS,
          subcategorie: Subcategorie.FORMATION
        }
      ];
    }).reduce((result, current) => result.concat(current), []);
     res.concat([{
       question: new CompositeQuestion({
         key: `formation`,
         dataCyIdentifier: `0702_formation`,
         label: {
           key: 'question.formation.label',
           parameters: {numberOfMemebres: eligibiliteGroup.demandeur.membresFamille.length}
         },
         items: membres.map(membre => ({
           question: new RadioQuestion({
             key: `formation_${membre.id}`,
             dataCyIdentifier: `0702_formation_${membre.id}`,
             label: {
               key: 'question.formation.membre',
               parameters: {
                 who: membre.id === 0 ? 'me' : 'them',
                 membre: membre.prenom
               }
             },
             errorLabels: {required: {key: 'question.formation.error.required'}},
             inline: true,
             radioOptions: REPONSE_PROGRESSIVE_OPTIONS
           }),
         }))
       }),
       calculateRefus: this.calculateFormationRefusFn,
       eligibilites: eligibiliteGroup.findByPrestation([Prestation.BOURSES]),
       categorie: Categorie.SITUATION_PERSONELLE,
       subcategorie: Subcategorie.FORMATION
     }]);
     return res;
/*
    return [
      {
        question: new CompositeQuestion({
          key: `formation`,
          dataCyIdentifier: `0702_formation`,
          label: {
            key: 'question.formation.label',
            parameters: {numberOfMemebres: eligibiliteGroup.demandeur.membresFamille.length}
          },
          items: membres.map(membre => ({
            question: new RadioQuestion({
              key: `formation_${membre.id}`,
              dataCyIdentifier: `0702_formation_${membre.id}`,
              label: {
                key: 'question.formation.membre',
                parameters: {
                  who: membre.id === 0 ? 'me' : 'them',
                  membre: membre.prenom
                }
              },
              errorLabels: {required: {key: 'question.formation.error.required'}},
              inline: true,
              radioOptions: REPONSE_PROGRESSIVE_OPTIONS
            }),
          }))
        }),
        calculateRefus: this.calculateFormationRefusFn,
        eligibilites: eligibiliteGroup.findByPrestation([Prestation.BOURSES]),
        categorie: Categorie.SITUATION_PERSONELLE,
        subcategorie: Subcategorie.FORMATION
      }
    ];*/
  }

  calculateFormationRefusFn(formData: FormData, eligibilites: Eligibilite[]): EligibiliteRefusee[] {
    const answers = (formData['formation'] as CompositeAnswer).answers;
    const eligibiliteGroup = new EligibiliteGroup(eligibilites);
    const refus: EligibiliteRefusee[] = [];

    eligibiliteGroup.findByPrestation([Prestation.PC_AVS_AI, Prestation.PC_FAM, Prestation.BOURSES]).forEach(eligibilite => {
      const membre = eligibilite.membre;
      const answer = (answers[`formation${membre.id}`] as OptionAnswer<string>);
      const choosenOption = answer ? answer.value : null;

      if (membre.id === 0 || (membre as MembreFamille).relation !== Relation.ENFANT) {
        const enfant = membre as MembreFamille;
        if (enfant.isOlder(25)
            || (enfant.isMajeur && choosenOption.value === ReponseProgressive.NON)) {
           refus.concat(QuestionUtils.createRefusByPrestationAndMembre(
            eligibilites, Prestation.PC_AVS_AI, membre, eli => ({
              key: `question.formation.motifRefus.${eli.prestation}`,
              parameters: {who: membre.id === 0 ? 'me' : 'them', membre: membre.prenom}
            })));
        }
      } else {
        if (membre.id === 0 && !this.hasEnfantACharge(membre as Demandeur, choosenOption)) {
          refus.concat(QuestionUtils.createRefusByPrestationAndMembre(
            eligibilites, Prestation.PC_FAM, membre, eli => ({
              key: `question.formation.motifRefus.${eli.prestation}`,
              parameters: {who: membre.id === 0 ? 'me' : 'them', membre: membre.prenom}
            })));
        }
        if (choosenOption.value === ReponseProgressive.NON) {
          refus.concat(QuestionUtils.createRefusByPrestationAndMembre(
            eligibilites, Prestation.BOURSES, membre, eli => ({
              key: `question.formation.motifRefus.${eli.prestation}`,
              parameters: {who: membre.id === 0 ? 'me' : 'them', membre: membre.prenom}
            })));
        }
      }
    });

     return refus;

  }

  private hasEnfantACharge(demandeur: Demandeur, choosenOption: QuestionOption<string>) {
    if (demandeur.enfants.length > 0) {
      // Si le demandeur a un enfant mineur, il est éligible
      return demandeur.enfants.some(enfant => !enfant.isMajeur
                                                      || enfant.isOlder(25)
                                                      || choosenOption.value === ReponseProgressive.OUI);

    }
    return false;
  }

  private calculateScolariteRefusFn(membre: Personne): RefusEligibiliteFn {
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
