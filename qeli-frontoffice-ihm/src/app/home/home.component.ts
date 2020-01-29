import { Component, OnInit } from '@angular/core';
import { Eligibilite, QuestionBase } from '../core/question/question-base.model';
import { CheckboxGroupQuestion } from '../core/question/checkbox-group-question/checkbox-group-question.model';
import { DateQuestion } from '../core/question/date-question/date-question.model';
import { FormGroup, Validators } from '@angular/forms';
import { QeliValidators } from '../core/validator/qeli-validators';
import { DropdownQuestion } from '../core/question/dropdown-question/dropdown-question.model';
import * as moment from 'moment';
import { NationaliteQuestion } from '../core/question/nationalite-question/nationalite-question.model';
import { RadioQuestion } from '../core/question/radio-question/radio-question.model';
import { Pays, PAYS_AELE_UE, PAYS_CONVETIONE } from '../core/common/pays.model';
import { QuestionOption } from '../core/question/option.model';
import { Prestation } from '../core/common/prestation.model';
import { EtatCivil } from '../core/common/etat-civil.model';
import { ReponseProgressive } from '../core/common/reponse-progressive.model';
import { Activite } from '../core/common/activite.model';
import { Scolarite } from '../core/common/scolarite.model';

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
        help: true,
        options: Object.keys(Prestation).map(prestation => new QuestionOption({label: prestation})),
        eligibilite: Object.values(Prestation).map(
          prestation => new Eligibilite(prestation, (form: FormGroup) => !this.hasPrestations(form, [prestation]))
        )
      }),
      new DateQuestion({
        key: 'dateNaissance',
        code: '0201',
        help: true,
        validators: [Validators.required, QeliValidators.past, QeliValidators.minYear(130)],
        eligibilite: [
          new Eligibilite(Prestation.AIDE_SOCIALE, (form: FormGroup) => !this.isMineur(form))
        ]
      }),
      new DropdownQuestion({
        key: 'etatCivil',
        code: '0301',
        help: true,
        options: Object.keys(EtatCivil),
        validators: [Validators.required],
        eligibilite: [
          new Eligibilite(Prestation.PC_AVS_AI, () => true),
          new Eligibilite(Prestation.BOURSES, () => true),
          new Eligibilite(Prestation.PC_FAM, () => true),
          new Eligibilite(Prestation.AIDE_SOCIALE, () => true)
        ]
      }),
      new NationaliteQuestion({
        key: 'nationalite',
        code: '0401',
        help: true,
        eligibilite: [
          new Eligibilite(Prestation.PC_AVS_AI, () => true),
          new Eligibilite(Prestation.BOURSES, () => true)
        ]
      }),
      new RadioQuestion({
        key: 'refugie',
        code: '0402',
        help: true,
        inline: true,
        options: Object.keys(ReponseProgressive).map(label => new QuestionOption({label: label})),
        validators: [Validators.required],
        defaultAnswer: (form: FormGroup) => (this.isSuisse(form) ||
                                             this.isUEOrAELE(form) ||
                                             this.isPayConventione(form) ||
                                             this.isApatride(form)) ? ReponseProgressive.NON : null,
        eligibilite: [
          new Eligibilite(Prestation.PC_AVS_AI, () => true),
          new Eligibilite(Prestation.BOURSES, () => true)
        ]
      }),
      new RadioQuestion({
        key: 'permisBEtudes',
        code: '0405',
        help: true,
        inline: true,
        options: Object.keys(ReponseProgressive).map(label => new QuestionOption({label: label})),
        validators: [Validators.required],
        defaultAnswer: (form: FormGroup) => (this.isSuisse(form) ||
                                             this.isRefugie(form) ||
                                             this.isApatride(form)) ? ReponseProgressive.INCONNU : null,
        eligibilite: [
          new Eligibilite(Prestation.BOURSES, () => true)
        ]
      }),
      new RadioQuestion({
        key: 'permisBPlus5Ans',
        code: '0406',
        help: true,
        inline: true,
        options: Object.keys(ReponseProgressive).map(label => new QuestionOption({label: label})),
        validators: [Validators.required],
        defaultAnswer: (form: FormGroup) => (this.isSuisse(form) ||
                                             this.isRefugie(form) ||
                                             this.isApatride(form)) ? ReponseProgressive.INCONNU : null,
        eligibilite: [
          new Eligibilite(
            Prestation.BOURSES, (form: FormGroup) => ReponseProgressive.NON !== form.value['permisBPlus5Ans']
          )
        ]
      }),

      new RadioQuestion({
        key: 'domicileCantonGE',
        code: '0501',
        help: true,
        inline: true,
        options: Object.keys(ReponseProgressive).map(label => new QuestionOption({label: label})),
        validators: [Validators.required],
        eligibilite: [
          new Eligibilite(
            Prestation.AVANCES, (form: FormGroup) => ReponseProgressive.NON !== form.value['domicileCantonGE']
          ),
          new Eligibilite(
            Prestation.ALLOCATION_LOGEMENT, (form: FormGroup) => ReponseProgressive.NON !== form.value['domicileCantonGE']
          ),
          new Eligibilite(
            Prestation.PC_AVS_AI, (form: FormGroup) => ReponseProgressive.NON !== form.value['domicileCantonGE']
          ),
          new Eligibilite(
            Prestation.PC_FAM, (form: FormGroup) => ReponseProgressive.NON !== form.value['domicileCantonGE']
          ),
          new Eligibilite(
            Prestation.AIDE_SOCIALE, (form: FormGroup) => ReponseProgressive.NON !== form.value['domicileCantonGE']
          )
        ]
      }),
      new CheckboxGroupQuestion({
        key: 'activite',
        code: '0601',
        help: true,
        hasNone: true,
        validators: [
          Validators.required,
          QeliValidators.atLeastOneSelected(Object.keys(Activite).concat('NONE'))
        ],
        options: Object.keys(Activite).map(label => new QuestionOption({label: label})),
        eligibilite: [
          new Eligibilite(Prestation.BOURSES, (form: FormGroup) => this.hasActivites(form, [Activite.ETUDIANT])),
          new Eligibilite(Prestation.PC_FAM, () => true),
          new Eligibilite(Prestation.AIDE_SOCIALE, () => true)
        ]
      }),
      new RadioQuestion({
        key: 'scolarite',
        code: '0701',
        help: true,
        hasNone: true,
        validators: [Validators.required],
        options: Object.values(Scolarite)
                       .filter(scolarite => scolarite !== Scolarite.AUCUNE)
                       .map(scolarite => new QuestionOption({label: Scolarite[scolarite], help: true}))
                       .concat(new QuestionOption({label: Scolarite.AUCUNE})),
        eligibilite: [
          new Eligibilite(Prestation.BOURSES, (form: FormGroup) => this.aucuneScolarite(form))
        ]
      }),
      new RadioQuestion({
        key: 'assuranceMaladieSuisse',
        code: '1101',
        help: true,
        inline: true,
        options: Object.keys(ReponseProgressive).map(label => new QuestionOption({label: label})),
        validators: [Validators.required],
        eligibilite: [
          new Eligibilite(
            Prestation.SUBSIDES, (form: FormGroup) => form.value['assuranceMaladieSuisse'] !== ReponseProgressive.NON
          )
        ]
      }),
      new RadioQuestion({
        key: 'exempteImpot',
        code: '1401',
        help: true,
        inline: true,
        options: Object.keys(ReponseProgressive).map(label => new QuestionOption({label: label})),
        validators: [Validators.required],
        eligibilite: [
          new Eligibilite(
            Prestation.SUBSIDES, (form: FormGroup) => form.value['exempteImpot'] !== ReponseProgressive.OUI
          )
        ]
      }),
      new RadioQuestion({
        key: 'taxeOfficeAFC',
        code: '1402',
        help: true,
        inline: true,
        labelParameters: {
          annee: moment().subtract(2, 'year').get('year')
        },
        options: Object.keys(ReponseProgressive).map(label => new QuestionOption({label: label})),
        validators: [Validators.required],
        eligibilite: [
          new Eligibilite(
            Prestation.SUBSIDES, (form: FormGroup) => form.value['taxeOfficeAFC'] !== ReponseProgressive.OUI
          )
        ]
      }),
      new RadioQuestion({
        key: 'fonctionnaireInternational',
        code: '1403',
        help: true,
        inline: true,
        options: Object.keys(ReponseProgressive).map(label => new QuestionOption({label: label})),
        validators: [Validators.required],
        altText: form => this.hasConjoint(form) ? 'avecConjoint' : null,
        eligibilite: [
          new Eligibilite(Prestation.BOURSES, (form: FormGroup) => !this.isFonctionnaireInternational(form))
        ]
      }),
      new RadioQuestion({
        key: 'parentsHabiteFranceTravailleSuisse',
        code: '1404',
        help: true,
        inline: true,
        options: Object.keys(ReponseProgressive).map(label => new QuestionOption({label: label})),
        validators: [Validators.required],
        defaultAnswer: (form: FormGroup) => !this.hasPermisBEtudes(form) ? ReponseProgressive.INCONNU : null,
        eligibilite: [
          new Eligibilite(
            Prestation.BOURSES,
            (form: FormGroup) => form.value['fonctionnaireInternational'] !== ReponseProgressive.NON
          )
        ]
      })
    ];
  }

  hasConjoint(form: FormGroup) {
    return form.value['etatCivil'] === EtatCivil.MARIE ||
           form.value['etatCivil'] === EtatCivil.PARTENARIAT_ENREGISTRE;
  }

  hasPermisBEtudes(form: FormGroup) {
    return form.value['permisBEtudes'] === ReponseProgressive.OUI;
  }

  isFonctionnaireInternational(form: FormGroup) {
    return form.value['fonctionnaireInternational'] === ReponseProgressive.OUI;
  }

  aucuneScolarite(form: FormGroup) {
    return form.value['scolarite'] === Scolarite.AUCUNE;
  }

  hasActivites(form: FormGroup, activites: Activite[]) {
    return !Object.entries(form.value['activite'])
                  .filter(entry => activites.includes(Activite[entry[0]]))
                  .map(entry => entry[1])
                  .includes(false);
  }

  isRefugie(form: FormGroup) {
    return form.value['refugie'] === ReponseProgressive.OUI;
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

  hasPrestations(form: FormGroup, prestations: Prestation[]) {
    return !Object.entries(form.value['prestations'])
                  .filter(entry => prestations.includes(Prestation[entry[0]]))
                  .map(entry => entry[1])
                  .includes(false);
  }
}
