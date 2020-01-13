import { Component, OnInit } from '@angular/core';
import { QuestionBase } from '../core/question/question-base.model';
import { CheckboxGroupQuestion } from '../core/question/checkbox-group-question.model';
import { DateQuestion } from '../core/question/date-question.model';
import { Validators } from '@angular/forms';
import { QeliValidators } from '../core/validator/qeli-validators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  questions: QuestionBase<any>[];
  result: any;

  constructor() {

  }

  ngOnInit(): void {
    this.questions = [
      new CheckboxGroupQuestion({
        key: 'prestations',
        code: '0101',
        options: [
          'subsides', 'avances', 'allocationLogement', 'subventionHm', 'pcAvsAi', 'bourses', 'pcFam', 'aideSociale'
        ],
        help: true
      }),
      new DateQuestion({
        key: 'dateNaissance',
        code: '0201',
        validators: [Validators.required, QeliValidators.past, QeliValidators.minYear(130)],
        skip: form => !Object.values(form.value['prestations']).includes(false),
        help: true
      })
    ];
  }
}
