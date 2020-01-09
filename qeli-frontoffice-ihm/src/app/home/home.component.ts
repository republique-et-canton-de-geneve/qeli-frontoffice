import { Component, OnInit } from '@angular/core';
import { QuestionBase } from '../core/question/question-base.model';
import { TextQuestion } from '../core/question/text-question.model';
import { DropdownQuestion } from '../core/question/dropdown-question.model';
import { DateQuestion } from '../core/question/date-question.model';

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
      new TextQuestion({key: 'nom', required: true, help: true}),
      new TextQuestion({key: 'prenom', required: true}),
      new DateQuestion({key: 'dateNaissance', required: true}),
      new DropdownQuestion({key: 'etatCivil', required: false, options: ["marie", "celibataire", "divorce"]})
    ];
  }
}
