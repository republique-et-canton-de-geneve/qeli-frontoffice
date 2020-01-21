import { Component, OnInit } from '@angular/core';
import { QuestionBase } from '../core/question/question-base.model';
import { CheckboxGroupQuestion } from '../core/question/checkbox-group-question/checkbox-group-question.model';
import { DateQuestion } from '../core/question/date-question/date-question.model';
import { FormGroup, Validators } from '@angular/forms';
import { QeliValidators } from '../core/validator/qeli-validators';
import { DropdownQuestion } from '../core/question/dropdown-question/dropdown-question.model';
import * as moment from 'moment';
import { NationaliteQuestion } from '../core/question/nationalite-question/nationalite-question.model';
import { RadioQuestion } from '../core/question/radio-question/radio-question.model';
import { Pays, PAYS_AELE_UE, PAYS_CONVETIONE } from '../core/common/pays.model';

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
        skip: form => this.hasPrestations(form, ['aideSociale']),
        help: true
      }),
      new DropdownQuestion({
        key: 'etatCivil',
        code: '0301',
        options: [
          'celibataire', 'marie', 'divorce', 'separe', 'partenariatEnregistre', 'veuf'
        ],
        validators: [Validators.required],
        skip: form => this.hasPrestations(form, ['pcAvsAi', 'bourses', 'pcFam', 'aideSociale']) ||
                      (
                        this.isMineur(form) &&
                        !this.hasPrestations(form, ['aideSociale']) &&
                        this.hasPrestations(form, ['pcAvsAi', 'bourses', 'pcFam'])
                      ),
        help: true
      }),
      new NationaliteQuestion({
        key: 'nationalite',
        code: '0401',
        skip: form => this.hasPrestations(form, ['pcAvsAi', 'bourses']),
        help: true
      }),
      new RadioQuestion({
        key: 'refugie',
        code: '0402',
        options: ['oui', 'non', 'inconnu'],
        validators: [Validators.required],
        skip: form => this.hasPrestations(form, ['pcAvsAi', 'bourses']) ||
                      this.isSuisse(form) ||
                      this.isUEOrAELE(form) ||
                      this.isPayConventione(form) ||
                      this.isApatride(form),
        inline: true,
        help: true
      }),
      new RadioQuestion({
        key: 'permisBEtudes',
        code: '0405',
        options: ['oui', 'non', 'inconnu'],
        validators: [Validators.required],
        skip: form => this.hasPrestations(form, ['bourses']) ||
                      this.isSuisse(form) ||
                      this.isRefugie(form) ||
                      this.isApatride(form),
        inline: true,
        help: true
      }),
      new RadioQuestion({
        key: 'permisBPlus5Ans',
        code: '0406',
        options: ['oui', 'non', 'inconnu'],
        validators: [Validators.required],
        skip: form => this.hasPrestations(form, ['bourses']) ||
                      this.isSuisse(form) ||
                      this.isRefugie(form) ||
                      this.isApatride(form),
        inline: true,
        help: true
      }),
      new CheckboxGroupQuestion({
        key: 'activite',
        code: '0601',
        hasNone: true,
        validators: [
          Validators.required,
          QeliValidators.atLeastOneSelected(['etudiant', 'emploi', 'chomage', 'retraite', 'invalide', 'sans', 'arret'])
        ],
        options: [
          'etudiant', 'emploi', 'chomage', 'retraite', 'invalide', 'sans', 'arret'
        ],
        skip: form => this.hasPrestations(form, ['bourses', 'pcFam', 'aideSociale']),
        help: true
      }),
      new RadioQuestion({
        key: 'scolarite',
        code: '0701',
        hasNone: true,
        validators: [Validators.required],
        options: [
          'scolariteObligatorie', 'formationContinue', 'formaitonDoctorale', 'maitriseUniversitaire', 'aucune'
        ],
        skip: form => this.hasPrestations(form, ['bourses']) ||
                      this.hasActivites(form, ['etudiant']) ||
                      form.value['permisBPlus5Ans'] === 'non',
        help: true
      })
    ];
  }

  hasActivites(form: FormGroup, activites: string[]) {
    return !Object.entries(form.value['activite'])
                  .filter(entry => activites.includes(entry[0]))
                  .map(entry => entry[1])
                  .includes(false);
  }

  isRefugie(form: FormGroup) {
    return form.value['refugie'] === 'oui';
  }

  isApatride(form: FormGroup) {
    const nationalite = form.value['nationalite'];
    return nationalite ? !!nationalite['apatride'] : false;
  }

  isSuisse(form: FormGroup) {
    const nationalite = form.value['nationalite'];
    const paysValues = nationalite['pays'] ? (nationalite['pays'] as string[]) : [];
    return paysValues ? paysValues.includes(Pays.CH) : false;
  }

  isUEOrAELE(form: FormGroup) {
    const nationalite = form.value['nationalite'];
    const paysValues = nationalite['pays'] ? (nationalite['pays'] as string[]) : [];
    return paysValues ? paysValues.some(pays => PAYS_AELE_UE.includes(pays)) : false;
  }

  isPayConventione(form: FormGroup) {
    const nationalite = form.value['nationalite'];
    const paysValues = nationalite['pays'] ? (nationalite['pays'] as string[]) : [];
    return paysValues ? paysValues.some(pays => PAYS_CONVETIONE.includes(pays)) : false;
  }

  isMineur(form: FormGroup) {
    const dateNaissance = form.value['dateNaissance'] && moment(form.value['dateNaissance'], 'YYYY-MM-DD');
    return dateNaissance && moment().subtract(18, 'year').endOf('day').isBefore(dateNaissance);
  }

  hasPrestations(form: FormGroup, prestations: string[]) {
    return !Object.entries(form.value['prestations'])
                  .filter(entry => prestations.includes(entry[0]))
                  .map(entry => entry[1])
                  .includes(false);
  }

  hasAllPrestations(form: FormGroup) {
    return !Object.values(form.value['prestations']).includes(false);
  }
}
