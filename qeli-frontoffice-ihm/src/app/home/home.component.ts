import { Component, OnInit } from '@angular/core';
import { QuestionBase } from '../core/question/question-base.model';
import { CheckboxGroupQuestion } from '../core/question/checkbox-group-question/checkbox-group-question.model';
import { DateQuestion } from '../core/question/date-question/date-question.model';
import { FormGroup, Validators } from '@angular/forms';
import { QeliValidators } from '../core/validator/qeli-validators';
import { DropdownQuestion } from '../core/question/dropdown-question/dropdown-question.model';
import * as moment from 'moment';

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
        skip: form => this.hasPrestation(form, 'aideSociale'),
        help: true
      }),
      new DropdownQuestion({
        key: 'etatCivil',
        code: '0301',
        options: [
          'celibataire', 'marie', 'divorce', 'separe', 'partenariatEnregistre', 'veuf'
        ],
        skip: form => this.isMineur(form) || this.hasAllPrestations(form),
        help: true
      }),
    ];
  }

  isMineur(form: FormGroup) {
    const dateNaissance = form.value['dateNaissance'] && moment(form.value['dateNaissance'], 'YYYY-MM-DD');
    return dateNaissance && moment().subtract(18, 'year').endOf('day').isBefore(dateNaissance);
  }

  hasPrestation(form: FormGroup, prestation: string) {
    return form.value['prestations'][prestation];
  }

  hasAllPrestations(form: FormGroup) {
    return !Object.values(form.value['prestations']).includes(false);
  }
}
