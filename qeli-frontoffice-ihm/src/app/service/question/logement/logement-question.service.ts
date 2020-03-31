import { Injectable } from '@angular/core';
import { QuestionLoader } from '../question-loader';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { QeliQuestionDecorator } from '../qeli-question-decorator.model';
import { Eligibilite } from '../eligibilite.model';

@Injectable({
  providedIn: 'root'
})
export class LogementQuestionService implements QuestionLoader {

  loadQuestions(configuration: QeliConfiguration, eligibilites: Eligibilite[]): QeliQuestionDecorator<any>[] {
    return [/*
      new RadioQuestion({
        key: 'proprietaireOuLocataireLogement',
        code: '1001',
        categorie: Categorie.COMPLEMENTS,
        subcategorie: Subcategorie.LOGEMENT,
        help: true,
        inline: true,
        options: Object.keys(Logement).map(label => ({label: label})),
        eligibilite: [
          {
            prestation: Prestation.ALLOCATION_LOGEMENT,
            isEligible: (value: any) => value['proprietaireOuLocataireLogement'] !== Logement.PROPRIETAIRE
          }
        ]
      }),
      new RadioQuestion({
        key: 'bailLogementAVotreNom',
        code: '1002',
        categorie: Categorie.COMPLEMENTS,
        subcategorie: Subcategorie.LOGEMENT,
        help: true,
        inline: true,
        options: Object.keys(ReponseProgressive).map(label => ({label: label})),
        eligibilite: [
          {
            prestation: Prestation.ALLOCATION_LOGEMENT,
            isEligible: (value: any) => value['bailLogementAVotreNom'] !== ReponseProgressive.NON
          }
        ]
      }),
      new NumberQuestion({
        key: 'nombreDePersonnesLogement',
        code: '1003',
        categorie: Categorie.COMPLEMENTS,
        subcategorie: Subcategorie.LOGEMENT,
        help: true,
        min: 1,
        max: 20,
        eligibilite: [
          {prestation: Prestation.ALLOCATION_LOGEMENT}
        ]
      }),
      new NumberQuestion({
        key: 'nombreDePiecesLogement',
        code: '1004',
        categorie: Categorie.COMPLEMENTS,
        subcategorie: Subcategorie.LOGEMENT,
        help: true,
        min: 1,
        max: 20,
        eligibilite: [
          {
            prestation: Prestation.ALLOCATION_LOGEMENT,
            isEligible: (value: any) => isRatioPiecesPersonnesLogementAcceptable(value)
          }
        ]
      }),
      new RadioQuestion({
        key: 'appartementHabitationMixte',
        code: '1005',
        categorie: Categorie.COMPLEMENTS,
        subcategorie: Subcategorie.LOGEMENT,
        help: true,
        inline: true,
        options: Object.keys(ReponseProgressive).map(label => ({label: label})),
        eligibilite: [
          {
            prestation: Prestation.ALLOCATION_LOGEMENT,
            isEligible: (value: any) => value['appartementHabitationMixte'] !== ReponseProgressive.OUI
          }
        ]
      }),
      new RadioQuestion({
        key: 'montantLoyerFixeOuVariable',
        code: '1006',
        categorie: Categorie.COMPLEMENTS,
        subcategorie: Subcategorie.LOGEMENT,
        help: true,
        options: Object.keys(Loyer).map(label => ({label: label})),
        eligibilite: [
          {
            prestation: Prestation.ALLOCATION_LOGEMENT,
            isEligible: (value: any) => value['montantLoyerFixeOuVariable'] !== Loyer.EN_FONCTION_REVENU
          }
        ]
      })*/
    ];
  }
}
