import { Component, OnInit, ViewChild } from '@angular/core';
import { QuestionBase } from '../core/question/question-base.model';
import { AllQuestions } from './question.configuration';
import { FormState } from '../core/dynamic-form/form-state.model';
import { DynamicFormComponent } from '../core/dynamic-form/dynamic-form.component';
import { ActivatedRoute } from '@angular/router';
import { DeepLinkService } from '../services/deep-link.service';
import { TrackingService } from '../services/tracking.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('dynamicForm') dynamicForm: DynamicFormComponent;

  questions: QuestionBase<any>[] = AllQuestions;
  formState: FormState = {
    data: {},
    currentIndex: 0,
    indexHistory: [],
    prestationsRefusees: [],
    prestationsRefuseesStack: [],
    done: false
  };

  constructor(
    private deepLinkService: DeepLinkService,
    private route: ActivatedRoute,
    private trackingService: TrackingService
    ) {
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

      this.trackPreviousFormAnswer(this.previousQuestion);
      this.trackingService.trackPageView(this.formState.done, this.questions[this.formState.currentIndex], this.formState.prestationsRefusees);
    });
  }

  trackPreviousFormAnswer(previousQuestion: QuestionBase<any>) {
    if (previousQuestion) {
      const previousQuestionCodeKey = previousQuestion.code + '_' + previousQuestion.key;
      const humanReadableAnswer = this.getHumanReadableAnswerForQuestion(previousQuestion, ';');
      this.trackingService.trackAnswer(previousQuestionCodeKey, humanReadableAnswer);
    }
  }

  get previousQuestion(): QuestionBase<any> {
    const previousQuestionIndex = this.formState.indexHistory[this.formState.indexHistory.length-1];
    return this.questions[previousQuestionIndex];
  }

  /**
   * Retourne la réponse à une question lisible pour un humain
   *
   * @param question
   * @param separator
   */
  getHumanReadableAnswerForQuestion(question: QuestionBase<any>, separator: string): string {
    let humanReadableAnswer = '';
    const questionAnswerValue = this.formState.data[question.key];
    switch (question.controlType) {
      case 'checkbox-group':
        let checkboxAnswer = [];
        Object.keys(questionAnswerValue).forEach((formAnswer)=> {
          if (questionAnswerValue[formAnswer]) {
            checkboxAnswer.push(formAnswer);
          }
        });
        humanReadableAnswer = checkboxAnswer.join(separator);
        break;
      case 'nationalite':
        if (questionAnswerValue['apatride']) {
          humanReadableAnswer = 'apatride';
        } else if (questionAnswerValue['pays'] && questionAnswerValue['pays'].length > 0) {
          let nationatiteAnswer = [];
          questionAnswerValue['pays'].forEach((formAnswer) => {
            if (formAnswer) {
              nationatiteAnswer.push(formAnswer);
            }
          });
          humanReadableAnswer = nationatiteAnswer.join(separator);
        }
        break;
      case 'radio':
      case 'text':
      case 'date':
      case 'dropdown':
        humanReadableAnswer = questionAnswerValue;
        break;
    }
    return humanReadableAnswer;
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
