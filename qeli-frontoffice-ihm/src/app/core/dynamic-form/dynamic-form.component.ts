import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { QuestionBase } from '../question/question-base.model';
import { FormGroup } from '@angular/forms';
import { Prestation } from '../common/prestation.model';
import { DeepLinkService } from '../deep-link.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {

  @Input() questions: QuestionBase<any>[] = [];
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();

  form: FormGroup;

  prestationsRefusees: { prestation: Prestation, questionKey: string }[] = [];
  prestationsRefuseesStack: { prestation: Prestation, questionKey: string }[][] = [];
  indexHistoryStack: number[] = [];
  currentQuestionIndex = 0;

  constructor(
    private deepLinkService: DeepLinkService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      let group: any = {};
      const formData = this.deepLinkService.decryptQueryParamData(params);

      if (formData) {
        this.prestationsRefusees = formData.prestationsRefusees;
        this.prestationsRefuseesStack = formData.prestationsRefuseesStack;
        this.indexHistoryStack = formData.indexHistoryStack;
        this.currentQuestionIndex = formData.currentQuestionIndex;
      }

      this.questions.forEach(question => {
        group[question.key] = question.toFormControl((formData ? formData.value[question.key] : null));
      });

      this.form = new FormGroup(group);
    });
  }

  isValid(question: QuestionBase<any>) {
    return this.form.controls[question.key].valid;
  }

  get prestationEligible() {
    return Object.values(Prestation).filter(
      prestation => !this.prestationsRefusees.some(
        prestationRefusee => prestationRefusee.prestation === prestation
      )
    );
  }

  nextQuestion() {
    if (this.isValid(this.currentQuestion)) {

      this.indexHistoryStack.push(this.currentQuestionIndex);
      this.prestationsRefuseesStack.push(this.prestationsRefusees);

      this.prestationEligible.filter(prestation => {
        const eligibilite = this.currentQuestion.eligibilite.filter(
          eligibilite => eligibilite.prestation === prestation
        );
        return (eligibilite.length > 0 && !eligibilite.every(eligibilite => eligibilite.isEligible((this.form))));
      }).forEach(prestationRefusee => {
        this.prestationsRefusees.push({
          prestation: prestationRefusee,
          questionKey: this.currentQuestion.key
        });
      });


      const nextIndex = this.questions.findIndex((question, index) => {
          if (index > this.currentQuestionIndex) {
            if (question.eligibilite.some(el => this.prestationEligible.includes(el.prestation))) {
              const answer = question.defaultAnswer ? question.defaultAnswer(this.form) : undefined;

              if (!answer) {
                return true;
              }

              this.form.controls[question.key].setValue(answer);
            }
          }

          return false;
        }
      );

      if (nextIndex === -1) {
        this.currentQuestionIndex = this.questions.length - 1;
        this.onSubmit.emit({
          data: this.form.value,
          prestationsRefusees: this.prestationsRefusees
        });
      } else {
        this.currentQuestionIndex = nextIndex;
      }

      this.deepLinkService.updateUrl(this.formStateToQueryParam());
    }
  }

  previousQuestion() {
    this.currentQuestionIndex = (this.indexHistoryStack.length > 0) ? this.indexHistoryStack.pop() : 0;
    this.prestationsRefuseesStack = (this.prestationsRefuseesStack.length > 0) ?
                                    this.prestationsRefuseesStack.pop() :
                                    Object.values(Prestation);

    this.deepLinkService.updateUrl(this.formStateToQueryParam());
  }

  onKeyUp(event: KeyboardEvent) {
    if (event.key === "Enter" && this.isValid(this.currentQuestion)) {
      this.nextQuestion();
    }
  }

  get currentQuestion() {
    return this.questions[this.currentQuestionIndex];
  }

  /**
   * Formate les données de l'état du formulaire dans le format attendu par le queryParam
   */
  formStateToQueryParam(): {} {
    return {
      value: this.form.value,
      prestationsRefusees: this.prestationsRefusees,
      prestationsRefuseesStack: this.prestationsRefuseesStack,
      indexHistoryStack: this.indexHistoryStack,
      currentQuestionIndex: this.currentQuestionIndex
    };
  }

}
