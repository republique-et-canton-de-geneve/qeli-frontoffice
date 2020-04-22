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
import { FormData } from '../../../dynamic-question/model/question.model';
import {
  CompositeAnswer, CompositeQuestion
} from '../../../dynamic-question/composite-question/composite-question.model';

@Injectable({
  providedIn: 'root'
})
export class FormationQuestionService implements QuestionLoader {

  loadQuestions(configuration: QeliConfiguration, eligibilites: Eligibilite[]): QeliQuestionDecorator<any>[] {
    const eligibiliteGroup = new EligibiliteGroup(eligibilites);
    const membres = ([eligibiliteGroup.demandeur] as (Personne)[]).concat(
      eligibiliteGroup.demandeur.membresFamille
    );
    const questions: QeliQuestionDecorator<any>[] = [];

    questions.push({
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
          })
        }))
      }),
      calculateRefus: this.calculateFormationRefusFn,
      eligibilites: eligibiliteGroup.findByPrestation([Prestation.BOURSES, Prestation.PC_FAM, Prestation.PC_AVS_AI]),
      categorie: Categorie.SITUATION_PERSONELLE,
      subcategorie: Subcategorie.FORMATION
    });

    membres.map((membre): QeliQuestionDecorator<any> => ({
      question: new RadioQuestion({
        key: `scolarite_${membre.id}`,
        dataCyIdentifier: `0701_scolarite_${membre.id}`,
        label: {
          key: 'question.scolarite.label',
          parameters: {who: membre.id === 0 ? 'me' : 'them', membre: membre.prenom}
        },
        errorLabels: {required: {key: 'question.scolarite.error.required'}},
        radioOptions: SCOLARITE_OPTIONS
      }),
      calculateRefus: this.calculateScolariteRefusFn(membre),
      eligibilites: eligibiliteGroup.findByPrestationEtMembre(Prestation.BOURSES, membre),
      categorie: Categorie.COMPLEMENTS,
      subcategorie: Subcategorie.FORMATION
    } as QeliQuestionDecorator<any>)).forEach(question => questions.push(question));

    return questions;
  }

  calculateFormationRefusFn(formData: FormData, eligibilites: Eligibilite[]): EligibiliteRefusee[] {
    const eligibiliteGroup = new EligibiliteGroup(eligibilites);
    const refus: EligibiliteRefusee[] = [];
    return refus.concat(this.calculateRefusFAMFormationFn(formData, eligibilites, eligibiliteGroup),
      this.calculateRefusAVSAIFormationFn(formData, eligibilites, eligibiliteGroup),
      this.calculateRefusBoursesFormationFn(formData, eligibilites, eligibiliteGroup));
  }

  private calculateRefusBoursesFormationFn(formData: FormData, eligibilites: Eligibilite[],
                                           eligibiliteGroup: EligibiliteGroup) {
    const nestedArrays: EligibiliteRefusee[][] = eligibiliteGroup.findByPrestation(Prestation.BOURSES)
                                                                 .filter(eligibilite => {
                                                                   const answers = (formData['formation'] as CompositeAnswer).answers;
                                                                   const answer = (answers[`formation_${eligibilite.membre.id}`] as OptionAnswer<string>);
                                                                   const choosenOption = answer ? answer.value : null;
                                                                   return choosenOption.value ===
                                                                          ReponseProgressive.NON;
                                                                 }).map((eligibilite): EligibiliteRefusee[] => {
          return QuestionUtils.createRefusByPrestationAndMembre(
            eligibilites, Prestation.BOURSES, eligibilite.membre, eli => ({
              key: `question.formation.motifRefus.${eli.prestation}`,
              parameters: {who: eligibilite.membre.id === 0 ? 'me' : 'them', membre: eligibilite.membre.prenom}
            }));
        }
      );
    return ([] as EligibiliteRefusee[]).concat(...nestedArrays);
  }

  private calculateRefusAVSAIFormationFn(formData: FormData, eligibilites: Eligibilite[],
                                         eligibiliteGroup: EligibiliteGroup) {
    const nestedArrays: EligibiliteRefusee[][] = eligibiliteGroup.findByPrestation(Prestation.PC_AVS_AI)
                                                                 .filter(eligibilite => {
                                                                   const answers = (formData['formation'] as CompositeAnswer).answers;
                                                                   const answer = (answers[`formation_${eligibilite.membre.id}`] as OptionAnswer<string>);
                                                                   const choosenOption = answer ? answer.value : null;
                                                                   return (eligibilite.membre.id &&
                                                                           (eligibilite.membre as MembreFamille).relation ===
                                                                           Relation.ENFANT &&
                                                                           this.isACharge(
                                                                             eligibilite.membre as MembreFamille,
                                                                             choosenOption.value));
                                                                 }).map((eligibilite): EligibiliteRefusee[] => {
          return QuestionUtils.createRefusByPrestationAndMembre(
            eligibilites, Prestation.PC_AVS_AI, eligibilite.membre, eli => ({
              key: `question.formation.motifRefus.${eli.prestation}`,
              parameters: {who: eligibilite.membre.id === 0 ? 'me' : 'them', membre: eligibilite.membre.prenom}
            })
          );
        }
      );
    return ([] as EligibiliteRefusee[]).concat(...nestedArrays);
  }

  private calculateRefusFAMFormationFn(formData: FormData, eligibilites: Eligibilite[],
                                       eligibiliteGroup: EligibiliteGroup) {
    const isFAMRefused = eligibiliteGroup.findByPrestation(Prestation.PC_FAM).some(eligibilite =>
      eligibilite.membre.id === 0 && this.hasEnfantACharge((eligibilite.membre as Demandeur), formData)
    );

    return !!isFAMRefused
           ? QuestionUtils.createRefusByPrestation(eligibilites,
        Prestation.PC_FAM,
        eli => ({
          key: `question.formation.motifRefus.${eli.prestation}`
        }))
           : [];
  }

  private hasEnfantACharge(demandeur: Demandeur, formData: FormData) {
    if (demandeur.enfants.length > 0) {
      // Si le demandeur a un enfant mineur, il est éligible
      return demandeur.enfants.some(enfant => {
        const answers = (formData['formation'] as CompositeAnswer).answers;
        const answer = (answers[`formation_${enfant.id}`] as OptionAnswer<string>);
        const choosenOption = answer ? answer.value : null;
        return this.isACharge(enfant, choosenOption.value);
      });

    }
    return false;
  }

  private isACharge(enfant: MembreFamille, choosenOption: string) {
    return !enfant.isMajeur || (!enfant.isOlder(25) && choosenOption === ReponseProgressive.OUI);
  }

  private calculateScolariteRefusFn(membre: Personne): RefusEligibiliteFn {
    return (formData: FormData, eligibilites: Eligibilite[]) => {
      const answer = (formData[`scolarite_${membre.id}`] as OptionAnswer<string>).value;

      if (answer.value === Scolarite.AUCUNE || answer.value === Scolarite.INCONNU) {
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
