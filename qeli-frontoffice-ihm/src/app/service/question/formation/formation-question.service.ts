import { Injectable } from '@angular/core';
import { QuestionLoader } from '../question-loader';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { QeliQuestionDecorator } from '../qeli-question-decorator.model';
import { Eligibilite } from '../eligibilite.model';

@Injectable({
  providedIn: 'root'
})
export class FormationQuestionService implements QuestionLoader {

  loadQuestions(configuration: QeliConfiguration, eligibilites: Eligibilite[]): QeliQuestionDecorator<any>[] {
    return [/*
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
    ];
  }
}
