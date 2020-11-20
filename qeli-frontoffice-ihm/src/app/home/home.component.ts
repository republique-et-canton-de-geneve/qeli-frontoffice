import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TrackingService } from '../service/tracking/tracking.service';
import { QeliConfigurationService } from '../service/configuration/qeli-configuration.service';
import { QuestionService } from '../service/question/question.service';
import { QeliFormComponent } from './qeli-form/qeli-form.component';
import { FormSetupComponent } from './form-setup/form-setup.component';
import { QeliState, QeliStateMachine, QeliStateSchema } from '../service/question/qeli-state.model';
import { QeliConfiguration } from '../service/configuration/qeli-configuration.model';
import { Demandeur } from '../service/configuration/demandeur.model';
import { FromSchemaToAnswerVisitor } from '../dynamic-question/model/to-answer.visitor.model';
import { StatsService } from '../service/stats.service';
import { DeepLinkService } from '../deep-link/deep-link.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

  @ViewChild('qeliSetupForm', {static: false}) qeliSetupForm: FormSetupComponent;
  @ViewChild('qeliForm', {static: false}) qeliForm: QeliFormComponent;

  demandeurData: Demandeur = null;
  qeliConfiguration: QeliConfiguration;
  qeliStateMachine: QeliStateMachine;
  displayFormSetupAlertModal = false;

  private _questionChangedSubscription: Subscription;

  constructor(private route: ActivatedRoute,
              private trackingService: TrackingService,
              private qeliConfigurationService: QeliConfigurationService,
              private questionService: QuestionService,
              private deepLinkService: DeepLinkService,
              private ref: ChangeDetectorRef,
              private statsService: StatsService) {
  }

  ngOnInit() {
    this.qeliConfigurationService.loadConfiguration().subscribe(configuration => {
      this.qeliConfiguration = configuration;
      this.trackingService.initMatomo(configuration);

      this.deepLinkService.onStateUpdated(this.route).subscribe(state => {
        if (!state) {
          if (this._questionChangedSubscription) {
            this._questionChangedSubscription.unsubscribe();
          }
          this.qeliStateMachine = null;
        } else if (!this.qeliStateMachine) {
          this.rebuildQeliStateMachine(state);
        } else if (state.currentQuestionIndex !== this.qeliStateMachine.state.currentQuestionIndex) {
          this.rebuildQeliStateMachine(state);
        }

        this.ref.markForCheck();
      });

      this.ref.markForCheck();
    });
  }

  private rebuildQeliStateMachine(state: QeliStateSchema) {
    this.createQeliStateMachine(new Demandeur(state.demandeur));

    let currentQuestion = this.qeliStateMachine.questions[0];
    while (currentQuestion && this.qeliStateMachine.state.currentQuestionIndex !== state.currentQuestionIndex) {
      const rawAnswer = state.formData[currentQuestion.question.key];
      const answer = currentQuestion.question.accept(new FromSchemaToAnswerVisitor(rawAnswer));
      currentQuestion = this.qeliStateMachine.answerAndGetNextQuestion(answer, false);
    }
  }

  onPreviousquestion() {
    if (this.qeliStateMachine.state.currentQuestionIndex === 0) {
      this.openModal();
    } else {
      this.qeliStateMachine.previousQuestion();
    }
  }

  onNextClicked() {
    if (this.qeliForm) {
      this.showNextQuestion();
    } else if (this.qeliSetupForm) {
      this.submitSetupForm();
    }
  }

  private showNextQuestion() {
    if (this.qeliForm.isCurrentQuestionValid()) {
      this.trackingService.trackReponseInconnu(
        this.qeliStateMachine.currentQuestion.question,
        this.qeliForm.currentAnswer
      );
      this.qeliStateMachine.answerAndGetNextQuestion(this.qeliForm.currentAnswer);
    } else {
      this.qeliForm.displayErrors();
    }
  }

  private submitSetupForm() {
    if (this.qeliSetupForm.isValid) {
      this.createQeliStateMachine(new Demandeur(this.qeliSetupForm.demandeur));
      this.onQuestionChanged();
    } else {
      this.qeliSetupForm.displayErrors();
    }
  }

  private createQeliStateMachine(demandeur: Demandeur) {
    const questions = this.questionService.loadQuestions(this.qeliConfiguration, demandeur);
    if (this._questionChangedSubscription) {
      this._questionChangedSubscription.unsubscribe();
    }
    this.qeliStateMachine = new QeliStateMachine(questions, new QeliState({demandeur: demandeur}));
    this._questionChangedSubscription =
      this.qeliStateMachine.onQuestionChangedEvent.subscribe(this.onQuestionChanged.bind(this));
  }

  private onQuestionChanged() {
    if (this.qeliStateMachine) {
      if (this.qeliStateMachine.state.done) {
        this.saveStats();
        this.trackingService.trackQeliResult(
          this.qeliStateMachine.state,
          this.qeliForm.formElement.nativeElement
        );
      } else {
        this.trackingService.trackQuestion(this.qeliStateMachine.currentQuestion.question);
      }
      
      this.deepLinkService.updateState(this.qeliStateMachine.state, this.route);
    }
  }

  private saveStats() {
    const state = this.qeliStateMachine.state;
    this.statsService.saveStats(
      state.formData,
      this.qeliStateMachine.currentEligibilites,
      state.eligibilitesRefusees,
      state.demandeur
    ).subscribe();
  }

  openModal() {
    this.displayFormSetupAlertModal = true;
  }

  onCancel() {
    this.displayFormSetupAlertModal = false;
  }

  returnToSetup() {
    this.displayFormSetupAlertModal = false;
    this.demandeurData = this.qeliStateMachine.state.demandeur;
    this.qeliStateMachine = null;
  }

}
