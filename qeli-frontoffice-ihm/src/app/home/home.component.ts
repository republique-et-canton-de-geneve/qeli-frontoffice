import { Component, OnInit } from '@angular/core';
import { QuestionBase } from '../core/question/question-base.model';
import { CheckboxGroupQuestion } from '../core/question/checkbox-group-question.model';

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
          'subside', 'avance', 'allocationLogement', 'subventionHm', 'pcAvsAi', 'bourses', 'pcFam', 'aideSociale'
        ],
        help: true
      })
      /*,
      new DateQuestion({
        key: 'dateNaissance',
        validators: [Validators.required]
      }),
      new TextQuestion({
        key: 'prenom',
        validators: [Validators.required],
        skip: (form: FormGroup) => form.value.nom === 'SKIP'
      }),
      new DropdownQuestion({
        key: 'etatCivil',
        options: ["marie", "celibataire", "divorce"]
      })*/
    ];
  }
}
