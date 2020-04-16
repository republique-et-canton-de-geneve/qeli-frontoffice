import { Injectable } from '@angular/core';
import { QuestionLoader, QuestionUtils } from '../question-loader';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { Categorie, QeliQuestionDecorator, Subcategorie } from '../qeli-question-decorator.model';
import { Eligibilite, EligibiliteGroup } from '../eligibilite.model';
import { RadioQuestion } from '../../../dynamic-question/radio-question/radio-question.model';
import { Prestation } from '../../configuration/prestation.model';
import { Logement } from './logement.model';
import { NumberAnswer } from '../../../dynamic-question/model/answer.model';
import { REPONSE_PROGRESSIVE_OPTIONS, ReponseProgressive } from '../reponse-binaire.model';
import { NumberQuestion } from '../../../dynamic-question/number-question/number-question.model';
import { Loyer } from './loyer.model';

@Injectable({
  providedIn: 'root'
})
export class LogementQuestionService implements QuestionLoader {

  loadQuestions(configuration: QeliConfiguration, eligibilites: Eligibilite[]): QeliQuestionDecorator<any>[] {
    const eligibiliteGroup = new EligibiliteGroup(eligibilites);
    return [
      {
        question: new RadioQuestion({
          key: 'proprietaireOuLocataireLogement',
          dataCyIdentifier: '1001_proprietaireOuLocataireLogement',
          label: {key: 'question.proprietaireOuLocataireLogement.label'},
          help: {key: 'question.proprietaireOuLocataireLogement.help'},
          inline: true,
          radioOptions: Object.keys(Logement).map(logement => ({
            value: logement,
            label: {key: `common.logement.${logement}`}
          }))
        }),
        calculateRefus: QuestionUtils.rejectPrestationByOptionAnswerFn(
          'proprietaireOuLocataireLogement',
          Logement.PROPRIETAIRE,
          Prestation.ALLOCATION_LOGEMENT,
          {key: `question.residenceEffectiveCantonGE.motifRefus.${Prestation.ALLOCATION_LOGEMENT}`}
        ),
        eligibilites: eligibiliteGroup.findByPrestation(Prestation.ALLOCATION_LOGEMENT),
        categorie: Categorie.COMPLEMENTS,
        subcategorie: Subcategorie.LOGEMENT
      },
      {
        question: new RadioQuestion({
          key: 'bailLogementAVotreNom',
          dataCyIdentifier: '1002_bailLogementAVotreNom',
          label: {key: 'question.bailLogementAVotreNom.label'},
          help: {key: 'question.bailLogementAVotreNom.help'},
          inline: true,
          radioOptions: REPONSE_PROGRESSIVE_OPTIONS
        }),
        calculateRefus: QuestionUtils.rejectPrestationByOptionAnswerFn(
          'bailLogementAVotreNom',
          ReponseProgressive.NON,
          Prestation.ALLOCATION_LOGEMENT,
          {key: `question.bailLogementAVotreNom.motifRefus.${Prestation.ALLOCATION_LOGEMENT}`}
        ),
        eligibilites: eligibiliteGroup.findByPrestation(Prestation.ALLOCATION_LOGEMENT),
        categorie: Categorie.COMPLEMENTS,
        subcategorie: Subcategorie.LOGEMENT
      },
      {
        question: new NumberQuestion({
          key: 'nombreDePersonnesLogement',
          dataCyIdentifier: '1003_nombreDePersonnesLogement',
          label: {key: 'question.nombreDePersonnesLogement.label'},
          help: {key: 'question.nombreDePersonnesLogement.help'},
          min: 1,
          max: 20
        }),
        calculateRefus: () => [],
        eligibilites: eligibiliteGroup.findByPrestation(Prestation.ALLOCATION_LOGEMENT),
        categorie: Categorie.COMPLEMENTS,
        subcategorie: Subcategorie.LOGEMENT
      },
      {
        question: new NumberQuestion({
          key: 'nombreDePiecesLogement',
          dataCyIdentifier: '1004_nombreDePiecesLogement',
          label: {key: 'question.nombreDePiecesLogement.label'},
          help: {key: 'question.nombreDePiecesLogement.help'},
          min: 1,
          max: 20
        }),
        calculateRefus: QuestionUtils.rejectPrestationFn(
          data => {
            const nbPersonnes = (data['nombreDePersonnesLogement'] as NumberAnswer).value;
            const nbPieces = (data['nombreDePiecesLogement'] as NumberAnswer).value;
            return (nbPieces - nbPersonnes) > 2;
          },
          Prestation.ALLOCATION_LOGEMENT,
          {key: `question.nombreDePiecesLogement.motifRefus.${Prestation.ALLOCATION_LOGEMENT}`}
        ),
        eligibilites: eligibiliteGroup.findByPrestation(Prestation.ALLOCATION_LOGEMENT),
        categorie: Categorie.COMPLEMENTS,
        subcategorie: Subcategorie.LOGEMENT
      },
      {
        question: new RadioQuestion({
          key: 'appartementHabitationMixte',
          dataCyIdentifier: '1005_appartementHabitationMixte',
          label: {key: 'question.appartementHabitationMixte.label'},
          help: {key: 'question.appartementHabitationMixte.help'},
          inline: true,
          radioOptions: REPONSE_PROGRESSIVE_OPTIONS
        }),
        calculateRefus: QuestionUtils.rejectPrestationByOptionAnswerFn(
          'appartementHabitationMixte',
          ReponseProgressive.OUI,
          Prestation.ALLOCATION_LOGEMENT,
          {key: `question.appartementHabitationMixte.motifRefus.${Prestation.ALLOCATION_LOGEMENT}`}
        ),
        eligibilites: eligibiliteGroup.findByPrestation(Prestation.ALLOCATION_LOGEMENT),
        categorie: Categorie.COMPLEMENTS,
        subcategorie: Subcategorie.LOGEMENT
      },
      {
        question: new RadioQuestion({
          key: 'montantLoyerFixeOuVariable',
          dataCyIdentifier: '1006_montantLoyerFixeOuVariable',
          label: {key: 'question.montantLoyerFixeOuVariable.label'},
          help: {key: 'question.montantLoyerFixeOuVariable.help'},
          radioOptions: Object.keys(Loyer).map(loyer => ({
            value: loyer,
            label: {key: `common.loyer.${loyer}`}
          }))
        }),
        calculateRefus: QuestionUtils.rejectPrestationByOptionAnswerFn(
          'montantLoyerFixeOuVariable',
          Loyer.EN_FONCTION_REVENU,
          Prestation.ALLOCATION_LOGEMENT,
          {key: `question.montantLoyerFixeOuVariable.motifRefus.${Prestation.ALLOCATION_LOGEMENT}`}
        ),
        eligibilites: eligibiliteGroup.findByPrestation(Prestation.ALLOCATION_LOGEMENT),
        categorie: Categorie.COMPLEMENTS,
        subcategorie: Subcategorie.LOGEMENT
      }
    ];
  }
}
