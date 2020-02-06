import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { QuestionBase } from '../question/question-base.model';
import { FormGroup } from '@angular/forms';
import { Prestation } from '../common/prestation.model';
import { DeepLinkService } from '../deep-link.service';
import { ActivatedRoute } from '@angular/router';
import { FormState, Refus } from './form-state.model';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {

  @Input() questions: QuestionBase<any>[] = [];
  @Output() onQuestionChanged: EventEmitter<FormState> = new EventEmitter();

  form: FormGroup;
  formState: FormState = {
    data: {},
    indexHistory: [],
    currentIndex: 0,
    prestationsRefusees: [],
    done: false
  };

  prestationsRefuseesStack: Refus[][] = [];

  constructor(
    private deepLinkService: DeepLinkService,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      let group: any = {};
      const formData = this.deepLinkService.decryptQueryParamData(params);

      if (formData) {
        this.formState.prestationsRefusees = formData.pr;
        this.formState.indexHistory = formData.ihs;
        this.formState.currentIndex = formData.cqi;
        this.prestationsRefuseesStack = formData.prs;
      }

      this.questions.forEach(question => {
        group[question.key] = question.toFormControl((formData ? formData.v[question.key] : null));
      });

      this.form = new FormGroup(group);
      this.onFormChanged();
    });
  }

  isValid(question: QuestionBase<any>) {
    return this.form.controls[question.key].valid;
  }

  get prestationEligible() {
    return Object.values(Prestation).filter(
      prestation => !this.formState.prestationsRefusees.some(
        prestationRefusee => prestationRefusee.prestation === prestation
      )
    );
  }

  nextQuestion() {
    if (this.isValid(this.currentQuestion)) {

      this.formState.indexHistory.push(this.formState.currentIndex);
      this.prestationsRefuseesStack.push(this.formState.prestationsRefusees.slice(0));

      this.prestationEligible.filter(prestation => {
        const eligibilite = this.currentQuestion.eligibilite.filter(
          eligibilite => eligibilite.prestation === prestation
        );
        return (eligibilite.length > 0 && !eligibilite.every(eligibilite => eligibilite.isEligible((this.form.value))));
      }).forEach(prestationRefusee => {
        this.formState.prestationsRefusees.push({
          prestation: prestationRefusee,
          questionKey: this.currentQuestion.key
        });
      });


      this.formState.currentIndex = this.questions.findIndex((question, index) => {
          if (index > this.formState.currentIndex) {
            if (question.eligibilite.some(el => this.prestationEligible.includes(el.prestation))) {
              const answer = question.defaultAnswer ? question.defaultAnswer(this.form.value) : undefined;

              if (!answer) {
                return true;
              }

              this.form.controls[question.key].setValue(answer);
            }
          }

          return false;
        }
      );

      this.deepLinkService.updateUrl(this.formStateToQueryParam());
      this.onFormChanged();
    }
  }

  onFormChanged() {
    this.formState.data = this.form.value;
    this.formState.done = this.formState.currentIndex === -1;
    this.onQuestionChanged.emit(this.formState);
  }

  previousQuestion() {
    this.formState.currentIndex = (this.formState.indexHistory.length > 0) ? this.formState.indexHistory.pop() : 0;
    this.formState.prestationsRefusees =
      (this.prestationsRefuseesStack.length > 0) ? this.prestationsRefuseesStack.pop() : [];
    this.deepLinkService.updateUrl(this.formStateToQueryParam());
    this.onFormChanged();
  }

  onKeyUp(event: KeyboardEvent) {
    if (event.key === "Enter" && this.isValid(this.currentQuestion)) {
      this.nextQuestion();
    }
  }

  get currentQuestion() {
    return this.questions[this.formState.currentIndex];
  }

  /**
   * Formate les données de l'état du formulaire dans le format attendu par le queryParam
   */
  formStateToQueryParam(): {} {
    return {
      v: this.form.value,
      pr: this.formState.prestationsRefusees,
      prs: this.prestationsRefuseesStack,
      ihs: this.formState.indexHistory,
      cqi: this.formState.currentIndex
    };
  }

}
