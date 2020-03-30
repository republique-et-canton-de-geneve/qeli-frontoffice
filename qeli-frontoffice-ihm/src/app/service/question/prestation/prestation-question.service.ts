import { Injectable } from '@angular/core';
import { QuestionLoader } from '../question-loader';
import {
  CheckboxGroupAnswer, CheckboxGroupQuestion
} from '../../../dynamic-question/checkbox-group-question/checkbox-group-question.model';
import { Prestation } from '../../configuration/prestation.model';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import {
  FormData
} from '../../../dynamic-question/model/quesiton.model';
import { Demandeur } from '../../configuration/demandeur.model';
import {
  Eligibilite,
  EligibiliteRefusee
} from '../eligibilite.model';
import { Categorie, QeliQuestionDecorator, Subcategorie } from '../qeli-question-decorator.model';

@Injectable({
  providedIn: 'root'
})
export class PrestationQuestionService implements QuestionLoader {

  loadQuestions(configuration: QeliConfiguration, demandeur: Demandeur): QeliQuestionDecorator<any>[] {
    return [
      {
        question: new CheckboxGroupQuestion({
          key: 'prestations',
          dataCyIdentifier: '0101_prestations',
          label: {key: 'question.prestations.label'},
          help: {key: 'question.prestations.help'},
          noneOptions: [
            {value: 'OUI', label: {key: 'question.prestations.none'}},
            {value: 'NON', label: {key: 'question.prestations.some'}},
            {value: 'INCONNU', label: {key: 'question.prestations.inconnu'}}
          ],
          checkboxOptions: Object.keys(Prestation).map(prestation => ({
            value: prestation, label: {key: `question.prestations.option.${prestation}`}
          }))
        }),
        eligibilites: Object.values(Prestation).map(prestation => ({prestation: prestation, membre: demandeur})),
        calculateRefus: this.calculateRefus.bind(this),
        categorie: Categorie.SITUATION_PERSONELLE,
        subcategorie: Subcategorie.PRESTATION
      }
    ];
  }

  hasAnyPrestations(prestationsAnswer: CheckboxGroupAnswer, prestations: Prestation[]) {
    const choicesAsPrestation = prestationsAnswer.choices.map(choice => Prestation[choice.value]);
    return prestations.some(prestation => choicesAsPrestation.includes(prestation));
  }

  createRefus(prestation: Prestation, eligibilites: Eligibilite[], dejaPercue: boolean = false): EligibiliteRefusee[] {
    return eligibilites.filter(eligibilite => eligibilite.prestation === prestation)
                       .map(eligibilite => ({
                         eligibilite: eligibilite,
                         motif: {key: `question.prestations.motifRefus.${prestation}`},
                         dejaPercue: dejaPercue
                       }));
  }

  isPestationDejaPercue(prestationsAnswer: CheckboxGroupAnswer, prestation: Prestation) {
    return prestationsAnswer.choices.some(choice => choice.value === prestation);
  }

  calculateRefus(formData: FormData, eligibilites: Eligibilite[]) {
    const refus: EligibiliteRefusee[] = [];
    const prestationsAnswer = formData['prestations'] as CheckboxGroupAnswer;

    if (this.hasAnyPrestations(prestationsAnswer, [Prestation.SUBSIDES,
                                                   Prestation.PC_AVS_AI,
                                                   Prestation.PC_FAM,
                                                   Prestation.AIDE_SOCIALE])) {
      const dejaPercue = this.isPestationDejaPercue(prestationsAnswer, Prestation.SUBSIDES);
      this.createRefus(Prestation.SUBSIDES, eligibilites, dejaPercue).forEach(item => refus.push(item));
    }

    if (this.hasAnyPrestations(prestationsAnswer, [Prestation.AVANCES])) {
      this.createRefus(Prestation.AVANCES, eligibilites, true).forEach(item => refus.push(item));
    }

    if (this.hasAnyPrestations(prestationsAnswer, [Prestation.ALLOCATION_LOGEMENT,
                                                   Prestation.SUBVENTION_HM,
                                                   Prestation.PC_AVS_AI])) {
      const dejaPercue = this.isPestationDejaPercue(prestationsAnswer, Prestation.ALLOCATION_LOGEMENT);
      this.createRefus(Prestation.ALLOCATION_LOGEMENT, eligibilites, dejaPercue).forEach(item => refus.push(item));
    }

    if (this.hasAnyPrestations(prestationsAnswer, [Prestation.PC_AVS_AI,
                                                   Prestation.PC_FAM])) {
      this.createRefus(
        Prestation.PC_AVS_AI,
        eligibilites,
        this.isPestationDejaPercue(prestationsAnswer, Prestation.PC_AVS_AI)
      ).forEach(item => refus.push(item));
      this.createRefus(
        Prestation.PC_FAM,
        eligibilites,
        this.isPestationDejaPercue(prestationsAnswer, Prestation.PC_FAM)
      ).forEach(item => refus.push(item));
    }

    if (this.hasAnyPrestations(prestationsAnswer, [Prestation.BOURSES])) {
      this.createRefus(Prestation.BOURSES, eligibilites, true).forEach(item => refus.push(item));
    }


    if (this.hasAnyPrestations(prestationsAnswer, [Prestation.AIDE_SOCIALE])) {
      this.createRefus(Prestation.AIDE_SOCIALE, eligibilites, true).forEach(item => refus.push(item));
    }

    return refus;
  }

}
