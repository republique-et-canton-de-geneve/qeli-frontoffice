import { Component, OnInit, ViewChild } from '@angular/core';
import { QuestionBase } from '../core/question/question-base.model';
import { AllQuestions } from './question.configuration';
import { FormState } from '../core/common/form-state.model';
import { DynamicFormComponent } from '../core/dynamic-form/dynamic-form.component';
import { ActivatedRoute } from '@angular/router';
import { DeepLinkService } from '../service/deep-link.service';
import { TrackingService } from '../service/tracking.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('dynamicForm', {static: true}) dynamicForm: DynamicFormComponent;

  questions: QuestionBase<any>[] = AllQuestions;
  formState: FormState = {
    data: {},
    currentIndex: 0,
    indexHistory: [],
    prestationsRefusees: [],
    prestationsRefuseesStack: [],
    done: false
  };

  constructor(private deepLinkService: DeepLinkService,
              private route: ActivatedRoute,
              private trackingService: TrackingService) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const formData = this.deepLinkService.decryptQueryParamsData(params);
      if (formData) {
        this.formState = {
          data: formData.v,
          currentIndex: formData.cqi,
          indexHistory: formData.ihs,
          prestationsRefusees: formData.pr,
          prestationsRefuseesStack: formData.prs,
          done: formData.cqi === -1
        };
      } else {
        this.formState = {
          data: {},
          currentIndex: 0,
          indexHistory: [],
          prestationsRefusees: [],
          prestationsRefuseesStack: [],
          done: false
        };
      }

      this.doTracking();
    });
  }

  doTracking() {
    const previousQuestion = this.previousQuestion;
    if (previousQuestion) {
      this.trackingService.trackReponse(previousQuestion, this.formState.data);
    }

    if (this.formState.done) { // result page :
      this.trackingService.trackFormSubmission(this.formState, this.dynamicForm.formElement.nativeElement);
      this.trackingService.trackReponsesFinales(this.questions, this.formState.data);
    }
  }

  get currentQuestion(): QuestionBase<any> {
    return this.questions[this.formState.currentIndex];
  }

  get previousQuestion(): QuestionBase<any> {
    const previousQuestionIndex = this.formState.indexHistory[this.formState.indexHistory.length - 1];
    return this.questions[previousQuestionIndex];
  }

  onQuestionChanged() {
    this.deepLinkService.updateUrl(this.formStateToQueryParam(), this.route);
  }

  /**
   * Formate les données de l'état du formulaire dans le format attendu par le queryParam
   */
  private formStateToQueryParam(): {} {
    return {
      v: this.formState.data,
      pr: this.formState.prestationsRefusees,
      prs: this.formState.prestationsRefuseesStack,
      ihs: this.formState.indexHistory,
      cqi: this.formState.currentIndex
    };
  }
}
