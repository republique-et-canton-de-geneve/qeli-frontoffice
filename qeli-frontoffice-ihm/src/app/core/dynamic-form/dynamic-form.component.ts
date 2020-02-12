import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { QuestionBase } from '../question/question-base.model';
import { FormGroup } from '@angular/forms';
import { Prestation } from '../common/prestation.model';
import { FormState, Refus } from '../common/form-state.model';
import { PrestationResolver } from '../common/prestation-resolver';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {

  @Input() questions: QuestionBase<any>[] = [];
  @Input() formState: FormState;
  @Output() onQuestionChanged: EventEmitter<FormState> = new EventEmitter();

  form: FormGroup;

  constructor() {
  }

  ngOnInit() {
    let group: any = {};

    this.questions.forEach(question => {
      group[question.key] = question.toFormControl((this.formState ? this.formState.data[question.key] : null));
    });

    this.form = new FormGroup(group);
  }

  isValid(question: QuestionBase<any>) {
    return this.form.controls[question.key].valid;
  }

  nextQuestion() {
    if (this.isValid(this.currentQuestion)) {

      this.indexHistory.push(this.currentQuestionIndex);
      this.prestationsRefuseesStack.push(this.prestationsRefusees.slice(0));

      this.prestationsRefusees = this.prestationsRefusees.concat(
        this.prestationEligible.filter(
          prestation => this.isRefuseeForCurrentQuestion(prestation)
        ).map(
          prestationRefusee => new Refus(prestationRefusee, this.currentQuestion.key)
        )
      );

      this.currentQuestionIndex = this.findNextQuestionIndex();
      this.emitQuestionChanged();
    }
  }

  private isRefuseeForCurrentQuestion(prestation: Prestation) {
    const eligibilite = this.currentQuestion.eligibilite.filter(
      eligibilite => eligibilite.prestation === prestation
    );

    return eligibilite.length > 0 &&
           !eligibilite.every(eligibilite => eligibilite.isEligible((this.form.value)));
  }

  private findNextQuestionIndex() {
    return this.questions.findIndex((question, index) => {
        if (index > this.currentQuestionIndex) {
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
  }

  private emitQuestionChanged() {
    this.formState.data = this.form.value;
    this.formState.done = this.currentQuestionIndex === -1;

    this.onQuestionChanged.emit(this.formState);
  }

  previousQuestion() {
    this.currentQuestionIndex = (this.indexHistory.length > 0) ? this.indexHistory.pop() : 0;
    this.prestationsRefusees = (this.prestationsRefuseesStack.length > 0) ? this.prestationsRefuseesStack.pop() : [];

    this.emitQuestionChanged();
  }

  navigateToQuestion(targetQuestion: QuestionBase<any>) {
    const targetQuestionIndex = this.questions.findIndex(question => targetQuestion.code === question.code);
    const stackIndex = this.indexHistory.findIndex(index => index === targetQuestionIndex);

    this.indexHistory = this.indexHistory.slice(0, stackIndex + 1);
    this.prestationsRefuseesStack = this.prestationsRefuseesStack.slice(0, stackIndex + 1);

    this.previousQuestion();
  }

  onKeyUp(event: KeyboardEvent) {
    if (event.key === "Enter" && this.isValid(this.currentQuestion)) {
      this.nextQuestion();
    }
  }

  get currentQuestion() {
    return this.formState.done ? null : this.questions[this.currentQuestionIndex];
  }

  get currentQuestionIndex() {
    return this.formState.currentIndex;
  }

  set currentQuestionIndex(currentIndex: number) {
    this.formState.currentIndex = currentIndex;
  }

  get indexHistory() {
    return this.formState.indexHistory;
  }

  set indexHistory(value: number[]) {
    this.formState.indexHistory = value;
  }

  get prestationsRefusees() {
    return this.formState.prestationsRefusees;
  }

  set prestationsRefusees(value: Refus[]) {
    this.formState.prestationsRefusees = value;
  }

  get prestationsRefuseesStack() {
    return this.formState.prestationsRefuseesStack;
  }

  set prestationsRefuseesStack(value: Refus[][]) {
    this.formState.prestationsRefuseesStack = value;
  }

  get prestationEligible() {
    return PrestationResolver.findPrestationsEligibles(this.prestationsRefusees);
  }

}
