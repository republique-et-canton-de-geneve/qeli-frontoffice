import { Injectable } from '@angular/core';
import { QeliConfiguration } from '../configuration/qeli-configuration.model';
import { QeliQuestionDecorator } from './qeli-question-decorator.model';
import { EnfantsQuestionService } from './enfants/enfants-question.service';
import { Demandeur } from '../configuration/demandeur.model';
import { PrestationQuestionService } from './prestation/prestation-question.service';
import { FormationQuestionService } from './formation/formation-question.service';
import { NationaliteQuestionService } from './nationalite/nationalite-question.service';
import { DomicileQuestionService } from './domicile/domicile-question.service';
import { RevenusQuestionService } from './revenus/revenus-question.service';
import { LogementQuestionService } from './logement/logement-question.service';
import { SituationProfesionelleQuestionService } from './situation-profesionelle/situation-profesionelle-question.service';
import { AssuranceMaladieQuestionService } from './assurance-maladie/assurance-maladie-question.service';
import { PensionAlimentaireQuestionService } from './pension-alimentaire/pension-alimentaire-question.service';
import { MontantFortuneQuestionService } from './montant-fortune/montant-fortune-question.service';
import { SituationFiscaleQuestionService } from './situation-fiscale/situation-fiscale-question.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  loadQuestions(configuration: QeliConfiguration, demandeur: Demandeur): QeliQuestionDecorator<any>[] {
    return [].concat(
      new EnfantsQuestionService(demandeur).loadQuestions(configuration),
      new PrestationQuestionService(demandeur).loadQuestions(configuration),
      new FormationQuestionService(demandeur).loadQuestions(configuration),
      new NationaliteQuestionService(demandeur).loadQuestions(configuration),
      new DomicileQuestionService(demandeur).loadQuestions(configuration),
      new RevenusQuestionService(demandeur).loadQuestions(configuration),
      new SituationProfesionelleQuestionService(demandeur).loadQuestions(configuration),
      new LogementQuestionService(demandeur).loadQuestions(configuration),
      new AssuranceMaladieQuestionService(demandeur).loadQuestions(configuration),
      new PensionAlimentaireQuestionService(demandeur).loadQuestions(configuration),
      new MontantFortuneQuestionService(demandeur).loadQuestions(configuration),
      new SituationFiscaleQuestionService(demandeur).loadQuestions(configuration)
    );
  }
}
