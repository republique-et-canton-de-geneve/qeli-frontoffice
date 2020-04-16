import { Injectable } from '@angular/core';
import { QuestionLoader } from '../question-loader';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { Categorie, QeliQuestionDecorator, Subcategorie } from '../qeli-question-decorator.model';
import { Eligibilite, EligibiliteGroup, EligibiliteRefusee } from '../eligibilite.model';
import { Demandeur, MembreFamille, Relation } from '../../configuration/demandeur.model';
import { Prestation } from '../../configuration/prestation.model';
import { RadioQuestion } from '../../../dynamic-question/radio-question/radio-question.model';
import { ReponseProgressive } from '../reponse-binaire.model';
import { OptionAnswer } from '../../../dynamic-question/model/answer.model';
import * as moment from 'moment';
import { FormData, QuestionOption } from '../../../dynamic-question/model/question.model';

@Injectable({
  providedIn: 'root'
})
export class FormationQuestionService implements QuestionLoader {

  loadQuestions(configuration: QeliConfiguration, eligibilites: Eligibilite[]): QeliQuestionDecorator<any>[] {

    const eligibiliteGroup = new EligibiliteGroup(eligibilites);
    const membres = ([eligibiliteGroup.demandeur] as (MembreFamille | Demandeur)[]).concat(
      eligibiliteGroup.demandeur.membresFamille
    );

    return membres.map((membre): QeliQuestionDecorator<any>[] => {
      const translateParams = {who: membre.id === 0 ? 'me' : 'them', membre: membre.prenom};
      return [
        {
          question: new RadioQuestion({
            key: `formation_${membre.id}`,
            dataCyIdentifier: `0702_formation_${membre.id}`,
            label: {
              key: 'question.formation.label',
              parameters: translateParams
            },
            radioOptions: Object.keys(ReponseProgressive).map(reponse => ({
              value: reponse,
              label: {key: `common.reponseProgressive.${reponse}`}
            })),

          }),
          calculateRefus: this.calculateFormationRefusFn(membre),
          eligibilites: eligibiliteGroup.findByPrestationEtMembre([Prestation.PC_FAM,
                                                                   Prestation.AIDE_SOCIALE,
                                                                   Prestation.PC_AVS_AI,
                                                                   Prestation.BOURSES], membre),
          categorie: Categorie.SITUATION_PERSONELLE,
          subcategorie: Subcategorie.FORMATION
        }
      ];
    }).reduce((result, current) => result.concat(current), []);
  }

  calculateFormationRefusFn(membre: MembreFamille | Demandeur) {
    return (formData: FormData, eligibilites: Eligibilite[]): EligibiliteRefusee[] => {
      const choosenOption = (formData[`formation_${membre.id}`] as OptionAnswer<string>).value;
      const refus: EligibiliteRefusee[] = [];
      if (membre.id !== 0 && (membre as MembreFamille).relation === Relation.ENFANT) {
        const enfant = membre as MembreFamille;
        if (!this.aMoins25(enfant)
            || (!this.aMoins18(enfant) && choosenOption.value === ReponseProgressive.NON)) {
          this.createRefusByPrestation(
            [Prestation.PC_AVS_AI], refus, eligibilites, membre
          ).forEach(eligibiliteRefusee => refus.push(eligibiliteRefusee));
        }
      } else {
        if (membre.id === 0 && !this.isEligibleFam(membre as Demandeur, choosenOption)) {
          this.createRefusByPrestation(
            [Prestation.PC_FAM], refus, eligibilites, membre
          ).forEach(eligibiliteRefusee => refus.push(eligibiliteRefusee));
        }
        if (choosenOption.value === ReponseProgressive.NON) {
          this.createRefusByPrestation(
            [Prestation.BOURSES], refus, eligibilites, membre
          ).forEach(eligibiliteRefusee => refus.push(eligibiliteRefusee));
        }
      }
      return [];
    };
  }

  private createRefusByPrestation(prestations: Prestation[],
      refus: EligibiliteRefusee[],
      eligibilites: Eligibilite[], membre: MembreFamille | Demandeur) {
      const translateParams = {who: membre.id === 0 ? 'me' : 'them', membre: membre.prenom};
      const eligibiliteGroup = new EligibiliteGroup(eligibilites);

      prestations.forEach(prestation => {
        eligibiliteGroup.findByPrestationEtMembre(prestation, membre).forEach(eligibilite => {
          refus.push({
            eligibilite: eligibilite,
            motif: {
              key: `question.revenus.motifRefus.${eligibilite.prestation}`,
              parameters: translateParams
            }
          });
        });
      });
      return refus;
    }

  private isEligibleFam(demandeur: Demandeur, choosenOption: QuestionOption<string>) {
    if (demandeur.enfants.length > 0) {
      // Si le demandeur a un enfant mineur, il est éligible
      return demandeur.enfants.some(enfant => this.aMoins18(enfant)
                                                      || !this.aMoins25(enfant)
                                                      || choosenOption.value === ReponseProgressive.OUI);

    }
    return false;
  }

  private aMoins25(membreFamille: MembreFamille) {
    return !!membreFamille.dateNaissance && moment().subtract(25, 'year').endOf('day').isBefore(membreFamille.dateNaissance);
  }

  private aMoins18(membreFamille: MembreFamille) {
    return !!membreFamille.dateNaissance && moment().subtract(18, 'year').endOf('day').isBefore(membreFamille.dateNaissance);
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
      })
      new RadioQuestion({
        key: 'scolarite',
        code: '0701',
        categorie: Categorie.COMPLEMENTS,
        subcategorie: Subcategorie.FORMATION,
        options: [
          {label: Scolarite.SCOLARITE_OBLIGATOIRE_1P_A_10P},
          {label: Scolarite.SCOLARITE_OBLIGATOIRE_11P, help: true},
          {label: Scolarite.FORMATION_DOCTORALE, help: true},
          {label: Scolarite.FORMATION_CONTINUE, help: true},
          {label: Scolarite.AUCUNE},
          {label: Scolarite.INCONNU}
        ],
        eligibilite: [
          {
            prestation: Prestation.BOURSES,
            isEligible: (value: any) => aucuneScolarite(value)
          }
        ]
      })*/

