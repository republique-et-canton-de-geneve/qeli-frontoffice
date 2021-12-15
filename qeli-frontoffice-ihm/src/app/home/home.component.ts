/*
 * qeli-frontoffice
 *
 * Copyright (C) 2019-2021 Republique et canton de Geneve
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { TranslateService } from '@ngx-translate/core';
import { NgcCookieConsentService, NgcInitializeEvent, NgcStatusChangeEvent } from 'ngx-cookieconsent';
import { CookieService } from 'ngx-cookie-service';
import {
  COOKIE_AGREED, COOKIE_BANNER, COOKIE_BANNER_STATUS_DISMISS, COOKIE_EXPIRY_DAYS, CookieAgreedStatus, CookieStatusUtils
} from '../service/cookie-status.utils';
import { FormResultService } from '../service/question/form-result.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy {

  @ViewChild('qeliSetupForm', {static: false}) qeliSetupForm: FormSetupComponent;
  @ViewChild('qeliForm', {static: false}) qeliForm: QeliFormComponent;

  demandeurData: Demandeur = null;
  qeliConfiguration: QeliConfiguration;
  qeliStateMachine: QeliStateMachine;
  displayFormSetupAlertModal = false;

  private _questionChangedSubscription: Subscription;

  private cookieDomain: string;
  private cookieInitializeSubscription: Subscription;
  private cookieStatusChangeSubscription: Subscription;

  constructor(private route: ActivatedRoute,
              private trackingService: TrackingService,
              private qeliConfigurationService: QeliConfigurationService,
              private questionService: QuestionService,
              private formResultService: FormResultService,
              private deepLinkService: DeepLinkService,
              private ref: ChangeDetectorRef,
              private statsService: StatsService,
              private translate: TranslateService,
              private ccService: NgcCookieConsentService,
              private cookieService: CookieService) {
  }

  ngOnInit() {
    this.subscribeToCookieConsent();

    this.qeliConfigurationService.loadConfiguration().subscribe(configuration => {
      this.qeliConfiguration = configuration;
      this.trackingService.initMatomo(configuration);
      this.initCookieBanner(configuration);

      if (this.cookieService.get(COOKIE_AGREED) === CookieAgreedStatus.ACCEPTED) {
        this.trackingService.setConsentGiven();
      }

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

  ngOnDestroy() {
    this.cookieInitializeSubscription.unsubscribe();
    this.cookieStatusChangeSubscription.unsubscribe();
  }

  private initCookieBanner(configuration: QeliConfiguration) {
    this.cookieDomain = CookieStatusUtils.generateCookieDomain(window.location.hostname);

    this.translate.get([
      'common.cookie.message', 'common.cookie.dismiss', 'common.cookie.link', 'common.cookie.href'
    ]).subscribe(data => {
      this.ccService.getConfig().content = this.ccService.getConfig().content || {};
      // Override default messages with the translated ones
      this.ccService.getConfig().content.message = data['common.cookie.message'];
      this.ccService.getConfig().content.dismiss = data['common.cookie.dismiss'];
      this.ccService.getConfig().content.link = data['common.cookie.link'];
      this.ccService.getConfig().content.href = data['common.cookie.href'];
      this.ccService.getConfig().cookie.name = COOKIE_BANNER;
      this.ccService.getConfig().cookie.domain = this.cookieDomain;

      // Banner enabled by configuration, and if cookie-agreed is not set :
      this.ccService.getConfig().enabled = configuration.cookieBannerEnabled && !this.cookieService.get(COOKIE_AGREED)
      this.ccService.destroy(); // remove previous cookie bar (with default messages)
      this.ccService.init(this.ccService.getConfig()); // update config with translated messages
    });
  }

  subscribeToCookieConsent() {
    this.cookieInitializeSubscription = this.ccService.initialize$.subscribe(
      (event: NgcInitializeEvent) => {
        // init event : if cookie-agreed is not set but cookie-banner is, delete the cookie and reset the banner :
        if (!CookieStatusUtils.isCookieAgreedSet(this.cookieService.get(COOKIE_AGREED)) &&
            event.status === COOKIE_BANNER_STATUS_DISMISS) {
          this.cookieService.delete(COOKIE_BANNER, '/', this.cookieDomain);
          this.ccService.getConfig().enabled = true;
          this.ccService.init(this.ccService.getConfig());
        }
      });

    this.cookieStatusChangeSubscription = this.ccService.statusChange$.subscribe(
      (event: NgcStatusChangeEvent) => {
        // status change event : if the banner is dismissed, then set the global cookie as accepted and consent given :
        if (event.status === COOKIE_BANNER_STATUS_DISMISS &&
            !this.cookieService.get(COOKIE_AGREED)) {
          this.cookieService.set(COOKIE_AGREED, CookieAgreedStatus.ACCEPTED,
            {expires: COOKIE_EXPIRY_DAYS, path: '/', domain: this.cookieDomain});
          this.trackingService.setConsentGiven();
        }
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
      this.formResultService.toFormResult(this.qeliStateMachine),
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
