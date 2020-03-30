import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeepLinkService } from '../deep-link/deep-link.service';
import { TrackingService } from '../service/tracking/tracking.service';
import { QeliConfigurationService } from '../service/configuration/qeli-configuration.service';
import { QuestionService } from '../service/question/question.service';
import { QeliFormComponent } from './qeli-form/qeli-form.component';
import { FormSetupComponent } from './form-setup/form-setup.component';
import { QeliState, QeliStateMachine } from '../service/question/qeli-state.model';
import { QeliConfiguration } from '../service/configuration/qeli-configuration.model';
import { Demandeur } from '../service/configuration/demandeur.model';
import { FromSchemaToAnswerVisitor } from '../dynamic-question/model/to-answer.visitor.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

  @ViewChild('qeliSetupForm', {static: false}) qeliSetupForm: FormSetupComponent;
  @ViewChild('qeliForm', {static: false}) qeliForm: QeliFormComponent;

  qeliConfiguration: QeliConfiguration;
  qeliStateMachine: QeliStateMachine;
  firstLoad = true;

  constructor(private deepLinkService: DeepLinkService,
              private route: ActivatedRoute,
              private trackingService: TrackingService,
              private qeliConfigurationService: QeliConfigurationService,
              private questionService: QuestionService,
              private ref: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.qeliConfigurationService.loadConfiguration().subscribe(configuration => {
      this.qeliConfiguration = configuration;

      this.route.queryParams.subscribe(params => {
        if (this.firstLoad) {
          const state = this.deepLinkService.decryptQueryParamsData(params);
          if (state !== null) {
            const demandeur = state.demandeur;
            const questions = this.questionService.loadQuestions(this.qeliConfiguration, new Demandeur(demandeur));

            state.formData = questions
              .map(decorator => decorator.question)
              .filter(question => state.formData.hasOwnProperty(question.key))
              .map(question => {
                let entry = {};
                entry[question.key] = question.accept(new FromSchemaToAnswerVisitor(state.formData[question.key]));
                return entry
              }).reduce((r, c) => Object.assign(r, c), {});

            this.qeliStateMachine = new QeliStateMachine(questions, new QeliState(state));
          }
        }

        this.firstLoad = false;
        this.ref.markForCheck();
      });

      this.ref.markForCheck();
    });
  }

  onPreviousquestion() {
    this.qeliStateMachine.previousQuestion();
    this.trackingService.trackQuestion(this.qeliStateMachine.currentQuestion.question);
    this.updateDeepLink();
  }

  onNextQuestion() {
    if (this.qeliForm && this.qeliForm.isCurrentQuestionValid()) {
      this.trackingService.trackAnswer(this.qeliStateMachine.currentQuestion.question, this.qeliForm.currentAnswer);
      this.qeliStateMachine.answerAndGetNextQuestion(this.qeliForm.currentAnswer);

      if (this.qeliStateMachine.state.done) {
        this.trackingService.trackQeliResult(
          this.qeliStateMachine.state,
          this.qeliStateMachine.questions.map(decorator => decorator.question),
          this.qeliForm.formElement.nativeElement
        );
      } else {
        this.trackingService.trackQuestion(this.qeliStateMachine.currentQuestion.question);
      }

      this.updateDeepLink();
    } else if (this.qeliSetupForm && this.qeliSetupForm.isValid) {
      const demandeur = this.qeliSetupForm.demandeur;
      const questions = this.questionService.loadQuestions(this.qeliConfiguration, demandeur);

      this.qeliStateMachine = new QeliStateMachine(
        questions, new QeliState({demandeur: demandeur})
      );
      this.trackingService.trackQuestion(this.qeliStateMachine.currentQuestion.question);
      this.updateDeepLink();
    }
  }

  private updateDeepLink() {
    this.deepLinkService.updateUrl(this.qeliStateMachine.state, this.route);
  }

  /*onKeyUp(event: KeyboardEvent) {
    if (event.key === "Enter" && this.isCurrentQuestionValid()) {
      this.nextQuestion();
    }
  }*/

  /**
   * Formate les données de l'état du formulaire dans le format attendu par le queryParam
   */
  /*private formStateToQueryParam(): {} {
    return {
      v: this.formState.data,
      pr: this.formState.prestationsRefusees,
      prs: this.formState.prestationsRefuseesStack,
      ihs: this.formState.indexHistory,
      cqi: this.formState.currentIndex
    };
  }*/
}
