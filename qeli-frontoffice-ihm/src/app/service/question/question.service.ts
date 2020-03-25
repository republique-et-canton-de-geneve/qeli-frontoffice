import { Injectable } from '@angular/core';
import { Demandeur, QeliConfiguration } from '../configuration/qeli-configuration.model';
import { QuestionBase } from '../../dynamic-form/dynamic-question/question/question-base.model';
import { QuestionLoader } from './question-loader';
import { PrestationQuestionService } from './prestation/prestation-question.service';
import { AgeQuestionService } from './age/age-question.service';
import { EtatCivilQuestionService } from './etat-civil/etat-civil-question.service';
import { NationaliteQuestionService } from './nationalite/nationalite-question.service';
import { DomicileQuestionService } from './domicile/domicle-question.service';
import { RevenusQuestionService } from './revenus/revenus-question.service';
import { SituationProfesionelleQuestionService } from './situation-profesionelle/situation-profesionelle-question.service';
import { LogementQuestionService } from './logement/logement-question.service';
import { AssuranceMaladieQuestionService } from './assurance-maladie/assurance-maladie-question.service';
import { PensionAlimentaireQuestionService } from './pension-alimentaire/pension-alimentaire-question.service';
import { MontantFortuneQuestionService } from './montant-fortune/montant-fortune-question.service';
import { SituationFiscaleQuestionService } from './situation-fiscale/situation-fiscale-question.service';
import { FormationQuestionService } from './formation/formation-question.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionService implements QuestionLoader {

  constructor(private prestationQuestionService: PrestationQuestionService,
              private ageQuestionService: AgeQuestionService,
              private etatCivilQuestionService: EtatCivilQuestionService,
              private nationaliteQuestion: NationaliteQuestionService,
              private domicileQuestionService: DomicileQuestionService,
              private revenusQuestionService: RevenusQuestionService,
              private formationQuestionService: FormationQuestionService,
              private situationProfesionelleQuestionService: SituationProfesionelleQuestionService,
              private logementQuestionService: LogementQuestionService,
              private assuranceMaladieQuestionService: AssuranceMaladieQuestionService,
              private pensionAlimentaireQuestionService: PensionAlimentaireQuestionService,
              private montantFortuneQuestionService: MontantFortuneQuestionService,
              private situationFiscaleQuestionService: SituationFiscaleQuestionService) {

  }

  loadQuestions(configuration: QeliConfiguration, demandeur: Demandeur): QuestionBase<any>[] {
    return [].concat(
      this.prestationQuestionService.loadQuestions(configuration, demandeur),
      this.ageQuestionService.loadQuestions(configuration, demandeur),
      this.etatCivilQuestionService.loadQuestions(configuration, demandeur),
      this.nationaliteQuestion.loadQuestions(configuration, demandeur),
      this.domicileQuestionService.loadQuestions(configuration, demandeur),
      this.revenusQuestionService.loadQuestions(configuration, demandeur),
      this.formationQuestionService.loadQuestions(configuration, demandeur),
      this.situationProfesionelleQuestionService.loadQuestions(configuration, demandeur),
      this.logementQuestionService.loadQuestions(configuration, demandeur),
      this.assuranceMaladieQuestionService.loadQuestions(configuration, demandeur),
      this.pensionAlimentaireQuestionService.loadQuestions(configuration, demandeur),
      this.montantFortuneQuestionService.loadQuestions(configuration, demandeur),
      this.situationFiscaleQuestionService.loadQuestions(configuration, demandeur)
    );
  }
}
