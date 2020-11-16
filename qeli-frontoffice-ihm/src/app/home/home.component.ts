import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QeliStateService } from './qeli-state.service';
import { TrackingService } from '../service/tracking/tracking.service';
import { QeliConfigurationService } from '../service/configuration/qeli-configuration.service';
import { QuestionService } from '../service/question/question.service';
import { QeliFormComponent } from './qeli-form/qeli-form.component';
import { FormSetupComponent } from './form-setup/form-setup.component';
import { QeliState, QeliStateMachine } from '../service/question/qeli-state.model';
import { QeliConfiguration } from '../service/configuration/qeli-configuration.model';
import { Demandeur } from '../service/configuration/demandeur.model';
import { FromSchemaToAnswerVisitor } from '../dynamic-question/model/to-answer.visitor.model';
import { StatsService } from '../service/stats.service';

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
  firstLoad = true;
  displayFormSetupAlertModal = false;

  constructor(private qeliStateService: QeliStateService,
              private route: ActivatedRoute,
              private trackingService: TrackingService,
              private qeliConfigurationService: QeliConfigurationService,
              private questionService: QuestionService,
              private ref: ChangeDetectorRef,
              private statsService: StatsService) {
  }

  ngOnInit() {
    this.qeliConfigurationService.loadConfiguration().subscribe(configuration => {
      this.qeliConfiguration = configuration;
      this.trackingService.initMatomo(configuration);

      this.qeliStateService.onStateChanged(this.route).subscribe(state => {
        if (state) {
          const demandeur = new Demandeur(state.demandeur);
          const questions = this.questionService.loadQuestions(this.qeliConfiguration, demandeur);

          state.formData = questions
            .map(decorator => decorator.question)
            .filter(question => state.formData.hasOwnProperty(question.key))
            .map(question => {
              const entry = {};
              entry[question.key] = question.accept(new FromSchemaToAnswerVisitor(state.formData[question.key]));
              return entry;
            }).reduce((r, c) => Object.assign(r, c), {});

          this.qeliStateMachine = new QeliStateMachine(questions, new QeliState(state));
        } else {
          this.qeliStateMachine = null;
        }

        this.firstLoad = false;
        this.ref.markForCheck();
      });

      this.ref.markForCheck();
    });
  }

  onPreviousquestion() {
    if (this.qeliStateMachine.state.currentQuestionIndex === 0) {
      this.openModal();
    } else {
      this.qeliStateMachine.previousQuestion();
      this.trackingService.trackQuestion(this.qeliStateMachine.currentQuestion.question);
      this.updateDeepLink();
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

      if (this.qeliStateMachine.state.done) {
        this.saveStats();
        this.trackingService.trackQeliResult(
          this.qeliStateMachine.state,
          this.qeliForm.formElement.nativeElement
        );
      } else {
        this.trackingService.trackQuestion(this.qeliStateMachine.currentQuestion.question);
      }

      this.updateDeepLink();
    } else {
      this.qeliForm.displayErrors();
    }
  }

  private submitSetupForm() {
    if (this.qeliSetupForm.isValid) {
      const demandeur = new Demandeur(this.qeliSetupForm.demandeur);
      const questions = this.questionService.loadQuestions(this.qeliConfiguration, demandeur);

      this.qeliStateMachine = new QeliStateMachine(
        questions, new QeliState({demandeur: demandeur})
      );
      this.trackingService.trackQuestion(this.qeliStateMachine.currentQuestion.question);
      this.updateDeepLink();
    } else {
      this.qeliSetupForm.displayErrors();
    }
  }

  private updateDeepLink() {
    if (this.qeliStateMachine) {
      this.qeliStateService.updateState(this.qeliStateMachine.state, this.route);
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
