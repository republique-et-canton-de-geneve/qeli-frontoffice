import { Component, OnInit, ViewChild } from '@angular/core';
import { QuestionBase } from '../core/question/question-base.model';
import { AllQuestions } from './question.configuration';
import { FormState } from '../core/dynamic-form/form-state.model';
import { DynamicFormComponent } from '../core/dynamic-form/dynamic-form.component';
import { ActivatedRoute } from '@angular/router';
import { DeepLinkService } from '../core/deep-link.service';

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
    private route: ActivatedRoute) {

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
      }
    });
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
