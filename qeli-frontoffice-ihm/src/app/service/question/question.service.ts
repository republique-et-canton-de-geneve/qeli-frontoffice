import { Injectable } from '@angular/core';
import { QeliConfiguration } from '../configuration/qeli-configuration.model';
import { QuestionLoader } from './question-loader';
import { PrestationQuestionService } from './prestation/prestation-question.service';
import { Demandeur } from '../configuration/demandeur.model';
import { QeliQuestionDecorator } from './qeli-question-decorator.model';

@Injectable({
  providedIn: 'root'
})
export class QuestionService implements QuestionLoader {

  constructor(private prestationQuestionService: PrestationQuestionService
              /*private ageQuestionService: AgeQuestionService,
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
              private situationFiscaleQuestionService: SituationFiscaleQuestionService*/) {

  }

  loadQuestions(configuration: QeliConfiguration, demandeur: Demandeur): QeliQuestionDecorator<any>[] {
    return [].concat(
      this.prestationQuestionService.loadQuestions(configuration, demandeur)
      /*this.ageQuestionService.loadQuestions(configuration, demandeur),
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
      this.situationFiscaleQuestionService.loadQuestions(configuration, demandeur)*/
    );
  }
}
