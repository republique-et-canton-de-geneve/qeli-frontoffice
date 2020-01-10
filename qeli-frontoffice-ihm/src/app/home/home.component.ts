import { Component, OnInit } from '@angular/core';
import { QuestionBase } from '../core/question/question-base.model';
import { TextQuestion } from '../core/question/text-question.model';
import { DropdownQuestion } from '../core/question/dropdown-question.model';
import { DateQuestion } from '../core/question/date-question.model';
import { FormGroup, Validators } from '@angular/forms';

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
      new DateQuestion({
        key: 'dateNaissance',
        validators: [Validators.required]
      }),
      new TextQuestion({
        key: 'nom',
        validators: [Validators.required],
        help: true
      }),
      new TextQuestion({
        key: 'prenom',
        validators: [Validators.required],
        skip: (form: FormGroup) => form.value.nom === 'SKIP'
      }),
      new DropdownQuestion({
        key: 'etatCivil',
        options: ["marie", "celibataire", "divorce"]
      })
    ];
  }
}
