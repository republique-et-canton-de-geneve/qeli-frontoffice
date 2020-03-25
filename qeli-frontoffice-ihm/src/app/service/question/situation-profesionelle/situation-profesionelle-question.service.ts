import { Injectable } from '@angular/core';
import { QuestionLoader } from '../question-loader';
import { QuestionBase } from '../../../dynamic-form/dynamic-question/question/question-base.model';
import { Categorie, Subcategorie } from '../../../dynamic-form/dynamic-question/question/question-categorie.model';
import { Prestation } from '../../../dynamic-form/model/prestation.model';
import {
  hasAnyRevenus, hasConjoint, isConcubinageAutreParent, isRatioPiecesPersonnesLogementAcceptable, sumTauxActivite,
  sumTauxActiviteAvecConjoint
} from '../qeli-questions.utils';
import { Demandeur, QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { RadioQuestion } from '../../../dynamic-form/dynamic-question/question/radio-question/radio-question.model';
import { ReponseBinaire, ReponseProgressive } from '../../../dynamic-form/model/reponse.model';
import { TauxQuestion } from '../../../dynamic-form/dynamic-question/question/taux-question/taux-question.model';
import { TypeRevenus } from '../revenus/revenus.model';
import { Logement } from '../logement/logement.model';
import { NumberQuestion } from '../../../dynamic-form/dynamic-question/question/number-question/number-question.model';
import { Loyer } from '../logement/loyer.model';

@Injectable({
  providedIn: 'root'
})
export class SituationProfesionelleQuestionService implements QuestionLoader {

  loadQuestions(configuration: QeliConfiguration, demandeur: Demandeur): QuestionBase<any>[] {
    return [
      new RadioQuestion({
        key: 'taxationOffice',
        code: '0901',
        categorie: Categorie.COMPLEMENTS,
        subcategorie: Subcategorie.SITUATION_PROFESSIONNELLE,
        help: true,
        inline: true,
        options: Object.keys(ReponseProgressive).map(label => ({label: label})),
        altText: value => isConcubinageAutreParent(value) ? 'avecConcubin' : null,
        eligibilite: [
          {
            prestation: Prestation.PC_FAM,
            isEligible: (value: any) => value['taxationOffice'] !== ReponseProgressive.OUI
          }
        ]
      }),
      new TauxQuestion({
        key: 'tauxActivite',
        code: '0902',
        categorie: Categorie.COMPLEMENTS,
        subcategorie: Subcategorie.SITUATION_PROFESSIONNELLE,
        skip: (value: any) => !hasAnyRevenus(value, [TypeRevenus.EMPLOI]),
        eligibilite: [
          {
            prestation: Prestation.PC_FAM,
            isEligible: (value: any) =>
              hasAnyRevenus(value, [TypeRevenus.CHOMAGE, TypeRevenus.APG]) ||
              hasConjoint(value) ||
              isConcubinageAutreParent(value) ||
              sumTauxActivite(value, false) > configuration.minTauxActiviteSeul
          }
        ]
      }),
      new TauxQuestion({
        key: 'tauxActiviteDernierEmploi',
        code: '0903',
        categorie: Categorie.COMPLEMENTS,
        subcategorie: Subcategorie.SITUATION_PROFESSIONNELLE,
        skip: (value: any) => !hasAnyRevenus(value, [TypeRevenus.CHOMAGE, TypeRevenus.APG]),
        eligibilite: [
          {prestation: Prestation.PC_FAM}
        ]
      }),
      new RadioQuestion({
        key: 'tauxActiviteVariable6DernierMois',
        code: '0912',
        categorie: Categorie.COMPLEMENTS,
        subcategorie: Subcategorie.SITUATION_PROFESSIONNELLE,
        options: Object.keys(ReponseBinaire).map(label => ({label: label})),
        skip: (value: any) => !hasAnyRevenus(value, [TypeRevenus.CHOMAGE, TypeRevenus.APG]) ||
                              sumTauxActivite(value, false) > configuration.minTauxActiviteSeul,
        eligibilite: [
          {
            prestation: Prestation.PC_FAM,
            isEligible: (value: any) => value['tauxActiviteVariable6DernierMois'] === ReponseBinaire.OUI ||
                                        hasConjoint(value) ||
                                        isConcubinageAutreParent(value)
          }
        ]
      }),

      new TauxQuestion({
        key: 'tauxActiviteMoyen6DernierMois',
        code: '0905',
        categorie: Categorie.COMPLEMENTS,
        subcategorie: Subcategorie.SITUATION_PROFESSIONNELLE,
        help: true,
        skip: (value: any) => value['tauxActiviteVariable6DernierMois'] !== ReponseBinaire.OUI,
        eligibilite: [
          {
            prestation: Prestation.PC_FAM,
            isEligible: (value: any) =>
              sumTauxActivite(value, true) > configuration.minTauxActiviteSeul ||
              hasConjoint(value) ||
              isConcubinageAutreParent(value)
          }
        ]
      }),
      new TauxQuestion({
        key: 'tauxActiviteConjoint',
        code: '0907',
        categorie: Categorie.COMPLEMENTS,
        subcategorie: Subcategorie.SITUATION_PROFESSIONNELLE,
        altText: value => isConcubinageAutreParent(value) ? 'concubin' : null,
        skip: (value: any) => !hasAnyRevenus(value, [TypeRevenus.EMPLOI], 'revenusConjoint') &&
                              !hasAnyRevenus(value, [TypeRevenus.EMPLOI], 'revenusConcubin'),
        eligibilite: [
          {
            prestation: Prestation.PC_FAM,
            isEligible: (value: any) =>
              hasAnyRevenus(value, [TypeRevenus.CHOMAGE, TypeRevenus.APG], 'revenusConjoint') ||
              hasAnyRevenus(value, [TypeRevenus.CHOMAGE, TypeRevenus.APG], 'revenusConcubin') ||
              sumTauxActiviteAvecConjoint(value, false) > configuration.minTauxActiviteAvecConjoint
          }
        ]
      }),
      new TauxQuestion({
        key: 'tauxActiviteDernierEmploiConjoint',
        code: '0908',
        categorie: Categorie.COMPLEMENTS,
        subcategorie: Subcategorie.SITUATION_PROFESSIONNELLE,
        altText: value => isConcubinageAutreParent(value) ? 'concubin' : null,
        skip: (value: any) =>
          !hasAnyRevenus(value, [TypeRevenus.CHOMAGE, TypeRevenus.APG], 'revenusConjoint') &&
          !hasAnyRevenus(value, [TypeRevenus.CHOMAGE, TypeRevenus.APG], 'revenusConcubin'),
        eligibilite: [
          {prestation: Prestation.PC_FAM}
        ]
      }),
      new RadioQuestion({
        key: 'tauxActiviteVariable6DernierMoisConjoint',
        code: '0913',
        categorie: Categorie.COMPLEMENTS,
        subcategorie: Subcategorie.SITUATION_PROFESSIONNELLE,
        options: Object.keys(ReponseBinaire).map(label => ({label: label})),
        altText: value => isConcubinageAutreParent(value) ? 'concubin' : null,
        skip: (value: any) =>
          (!hasAnyRevenus(value, [TypeRevenus.CHOMAGE, TypeRevenus.APG], 'revenusConjoint') &&
           !hasAnyRevenus(value, [TypeRevenus.CHOMAGE, TypeRevenus.APG], 'revenusConcubin')) ||
          sumTauxActiviteAvecConjoint(value, false) > configuration.minTauxActiviteAvecConjoint,
        eligibilite: [
          {
            prestation: Prestation.PC_FAM,
            isEligible: (value: any) => value['tauxActiviteVariable6DernierMoisConjoint'] === ReponseBinaire.OUI
          }
        ]
      }),

      new TauxQuestion({
        key: 'tauxActiviteMoyen6DernierMoisConjoint',
        code: '0910',
        categorie: Categorie.COMPLEMENTS,
        subcategorie: Subcategorie.SITUATION_PROFESSIONNELLE,
        help: true,
        altText: value => isConcubinageAutreParent(value) ? 'concubin' : null,
        skip: (value: any) => value['tauxActiviteVariable6DernierMoisConjoint'] !== ReponseBinaire.OUI,
        eligibilite: [
          {
            prestation: Prestation.PC_FAM,
            isEligible: (value: any) =>
              sumTauxActiviteAvecConjoint(value, true) > configuration.minTauxActiviteAvecConjoint
          }
        ]
      })
    ];

    const LogementQuestions: QuestionBase<any>[] = [
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
      })
    ];
  }
}
