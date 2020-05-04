import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
import { StatsService } from '../service/stats.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

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
              private ref: ChangeDetectorRef,
              private statsService: StatsService,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    this.qeliConfigurationService.loadConfiguration().subscribe(configuration => {
      this.qeliConfiguration = configuration;
      this.trackingService.initMatomo(configuration);

      this.route.queryParams.subscribe(params => {
        // if (this.firstLoad) {
        const state = this.deepLinkService.decryptQueryParamsData(params);
        if (state !== null) {
          const demandeur = new Demandeur(state.demandeur);
          const questions = this.questionService.loadQuestions(this.qeliConfiguration, demandeur.toEligibilite());

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
        // }

        this.firstLoad = false;
        this.ref.markForCheck();
      });

      this.ref.markForCheck();
    });
  }

  onPreviousquestion() {
    if(this.qeliStateMachine.state.currentQuestionIndex === 0) {
      console.log('open Modal');
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
      const questions = this.questionService.loadQuestions(this.qeliConfiguration, demandeur.toEligibilite());

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
    this.deepLinkService.updateUrl(this.qeliStateMachine.state, this.route);
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

  closeResult: string;

  private openModal(content) {
    console.log('openModal');
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      console.log('inside');
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      console.log('inside 2');
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
}
