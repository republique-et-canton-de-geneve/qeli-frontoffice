import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { QuestionBase } from '../question/question-base.model';
import { FormGroup } from '@angular/forms';
import { Prestation } from '../common/prestation.model';
import { FormState } from './form-state.model';

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
      this.formState.prestationsRefuseesStack.push(this.formState.prestationsRefusees.slice(0));

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
      (this.formState.prestationsRefuseesStack.length > 0) ? this.formState.prestationsRefuseesStack.pop() : [];

    this.onFormChanged();
  }

  navigateToQuestion(targetQuestion: QuestionBase<any>) {
    const targetQuestionIndex = this.questions.findIndex(question => targetQuestion.code === question.code);
    const stackIndex = this.formState.indexHistory.findIndex(index => index === targetQuestionIndex);

    this.formState.indexHistory = this.formState.indexHistory.slice(0, stackIndex + 1);
    this.formState.prestationsRefuseesStack = this.formState.prestationsRefuseesStack.slice(0, stackIndex + 1);

    this.previousQuestion();
  }

  onKeyUp(event: KeyboardEvent) {
    if (event.key === "Enter" && this.isValid(this.currentQuestion)) {
      this.nextQuestion();
    }
  }

  get currentQuestion() {
    return this.questions[this.formState.currentIndex];
  }

}
