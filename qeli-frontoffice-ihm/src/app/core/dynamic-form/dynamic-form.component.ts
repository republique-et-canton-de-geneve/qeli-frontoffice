import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { QuestionBase } from '../question/question-base.model';
import { FormGroup } from '@angular/forms';
import { Prestation } from '../common/prestation.model';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {

  @Input() questions: QuestionBase<any>[] = [];
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();

  form: FormGroup;

  prestationEligible = Object.values(Prestation);
  prestationEligibleHistoryStack: Prestation[][] = [];
  indexHistoryStack: number[] = [];
  currentQuestionIndex = 0;

  constructor() {

  }

  ngOnInit() {
    let group: any = {};

    this.questions.forEach(question => {
      group[question.key] = question.toFormControl();
    });

    this.form = new FormGroup(group);
  }

  isValid(question: QuestionBase<any>) {
    return this.form.controls[question.key].valid;
  }

  nextQuestion() {
    if (this.isValid(this.currentQuestion)) {

      this.indexHistoryStack.push(this.currentQuestionIndex);
      this.prestationEligibleHistoryStack.push(this.prestationEligible);

      this.prestationEligible = this.prestationEligible.filter(prestation => {
        const eligibilite = this.currentQuestion.eligibilite.filter(
          eligibilite => eligibilite.prestation === prestation
        );
        console.log(eligibilite);
        return eligibilite.length === 0 || eligibilite.every(eligibilite => eligibilite.isEligible((this.form)))
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
          prestationEligible: this.prestationEligible
        });
      } else {
        this.currentQuestionIndex = nextIndex;
      }
    }
  }

  previousQuestion() {
    this.currentQuestionIndex = (this.indexHistoryStack.length > 0) ? this.indexHistoryStack.pop() : 0;
    this.prestationEligible = (this.prestationEligibleHistoryStack.length > 0) ?
                              this.prestationEligibleHistoryStack.pop() :
                              Object.values(Prestation);
  }

  onKeyUp(event: KeyboardEvent) {
    if (event.key === "Enter" && this.isValid(this.currentQuestion)) {
      this.nextQuestion();
    }
  }

  get currentQuestion() {
    return this.questions[this.currentQuestionIndex];
  }
}
