import { Injectable } from '@angular/core';
import { QeliConfiguration } from '../configuration/qeli-configuration.model';
import { QuestionLoader } from './question-loader';
import { PrestationQuestionService } from './prestation/prestation-question.service';
import { DomicileQuestionService } from './domicile/domicile-question.service';
import { QeliQuestionDecorator } from './qeli-question-decorator.model';
import { Eligibilite } from './eligibilite.model';
import { EnfantsQuestionService } from './enfants/enfants-question.service';
import { NationaliteQuestionService } from './nationalite/nationalite-question.service';
import { LogementQuestionService } from './logement/logement-question.service';
import { PensionAlimentaireQuestionService } from './pension-alimentaire/pension-alimentaire-question.service';
import { AssuranceMaladieQuestionService } from './assurance-maladie/assurance-maladie-question.service';
import { RevenusQuestionService } from './revenus/revenus-question.service';
import { FormationQuestionService } from './formation/formation-question.service';
import { MontantFortuneQuestionService } from './montant-fortune/montant-fortune-question.service';
import { SituationFiscaleQuestionService } from './situation-fiscale/situation-fiscale-question.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionService implements QuestionLoader {

  constructor(private prestationQuestionService: PrestationQuestionService,
              private enfantsQuestionService: EnfantsQuestionService,
              private nationaliteQuestion: NationaliteQuestionService,
              private domicileQuestionService: DomicileQuestionService,
              private revenusQuestionService: RevenusQuestionService,
              private formationQuestionService: FormationQuestionService,
              // private situationProfesionelleQuestionService: SituationProfesionelleQuestionService,
              private logementQuestionService: LogementQuestionService,
              private assuranceMaladieQuestionService: AssuranceMaladieQuestionService,
              private pensionAlimentaireQuestionService: PensionAlimentaireQuestionService,
              private montantFortuneQuestionService: MontantFortuneQuestionService,
              private situationFiscaleQuestionService: SituationFiscaleQuestionService
  ) {

  }

  loadQuestions(configuration: QeliConfiguration, eligibilites: Eligibilite[]): QeliQuestionDecorator<any>[] {
    return [].concat(
      this.prestationQuestionService.loadQuestions(configuration, eligibilites),
      this.enfantsQuestionService.loadQuestions(configuration, eligibilites),
      this.nationaliteQuestion.loadQuestions(configuration, eligibilites),
      this.formationQuestionService.loadQuestions(configuration, eligibilites),
      this.domicileQuestionService.loadQuestions(configuration, eligibilites),
      this.revenusQuestionService.loadQuestions(configuration, eligibilites),
      // this.situationProfesionelleQuestionService.loadQuestions(configuration, eligibilites),
      this.logementQuestionService.loadQuestions(configuration, eligibilites),
      this.assuranceMaladieQuestionService.loadQuestions(configuration, eligibilites),
      this.pensionAlimentaireQuestionService.loadQuestions(configuration, eligibilites),
      this.montantFortuneQuestionService.loadQuestions(configuration, eligibilites),
      this.situationFiscaleQuestionService.loadQuestions(configuration, eligibilites)
    );
  }
}
