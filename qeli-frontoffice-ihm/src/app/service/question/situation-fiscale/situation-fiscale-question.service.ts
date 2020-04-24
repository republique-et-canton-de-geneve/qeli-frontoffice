import { Injectable } from '@angular/core';
import { QuestionLoader, QuestionUtils } from '../question-loader';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { Categorie, QeliQuestionDecorator, Subcategorie } from '../qeli-question-decorator.model';
import { Eligibilite, EligibiliteGroup, EligibiliteRefusee } from '../eligibilite.model';
import { MembreFamille, Personne, Relation } from '../../configuration/demandeur.model';
import { RadioQuestion } from '../../../dynamic-question/radio-question/radio-question.model';
import { REPONSE_PROGRESSIVE_OPTIONS, ReponseProgressive } from '../reponse-binaire.model';
import { Prestation } from '../../configuration/prestation.model';
import { FormData } from '../../../dynamic-question/model/question.model';
import { CheckboxGroupAnswer } from '../../../dynamic-question/checkbox-group-question/checkbox-group-question.model';
import { I18nString } from '../../../core/i18n/i18nstring.model';
import has = Reflect.has;
import { TypeEnfant } from '../enfants/type-enfant.model';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class SituationFiscaleQuestionService implements QuestionLoader {

  loadQuestions(configuration: QeliConfiguration, eligibilites: Eligibilite[]): QeliQuestionDecorator<any>[] {
    const eligibiliteGroup = new EligibiliteGroup(eligibilites);
    const membres = ([eligibiliteGroup.demandeur] as (Personne)[]).concat(
      eligibiliteGroup.demandeur.membresFamille
    );
    return [
      {
        question: new RadioQuestion({
          key: `exempteImpot`,
          help: {
            key: 'question.exempteImpot.help',
          },
          dataCyIdentifier: `1401_exempteImpot`,
          label: (value: any) => {
            const answers = value['parentsEnfants'];
            const membresFamille  = eligibiliteGroup.demandeur.membresFamille;
            const hasEnfantToutLesDeux = membresFamille.some(membre => answers[`parentsEnfants_${membre.id}`] === TypeEnfant.LES_DEUX);
            const isValidConjoint = eligibiliteGroup.demandeur.hasConjoint ||
                                    (eligibiliteGroup.demandeur.hasConcubin && hasEnfantToutLesDeux);
            const conjointPrenom = isValidConjoint ? eligibiliteGroup.demandeur.partenaire.prenom : '';
            return {
              key: 'question.exempteImpot.label',
              parameters: {
                hasConjoint: isValidConjoint ? 'yes' : 'no',
                conjoint: conjointPrenom
              }
            } as I18nString;
          },
          radioOptions: REPONSE_PROGRESSIVE_OPTIONS
        }),
        calculateRefus: QuestionUtils.rejectPrestationByOptionAnswerFn(
          'exempteImpot',
          ReponseProgressive.OUI,
          Prestation.SUBSIDES,
          (eligibilite) => ({key: `question.exempteImpot.motifRefus.${eligibilite.prestation}`})
        ),
        eligibilites: eligibiliteGroup.findByPrestation(
          Prestation.SUBSIDES),
        categorie: Categorie.SITUATION_PERSONELLE,
        subcategorie: Subcategorie.SITUATION_FISCALE
      }
    ];
  }

}

/*
new RadioQuestion({
  key: 'exempteImpot',
  code: '1401',
  categorie: Categorie.COMPLEMENTS,
  subcategorie: Subcategorie.SITUATION_FISCALE,
  help: true,
  inline: true,
  options: Object.keys(ReponseProgressive).map(label => ({label: label})),
  eligibilite: [
    {
      prestation: Prestation.SUBSIDES,
      isEligible: (value: any) => value['exempteImpot'] !== ReponseProgressive.OUI
    }
  ]
}),
new RadioQuestion({
  key: 'taxeOfficeAFC',
  code: '1402',
  categorie: Categorie.COMPLEMENTS,
  subcategorie: Subcategorie.SITUATION_FISCALE,
  help: true,
  inline: true,
  labelParameters: {
    annee: moment().subtract(configuration.taxationAfcYearsFromNow, 'year').get('year')
  },
  options: Object.keys(ReponseProgressive).map(label => ({label: label})),
  eligibilite: [
    {
      prestation: Prestation.SUBSIDES,
      isEligible: (value: any) => value['taxeOfficeAFC'] !== ReponseProgressive.OUI
    }
  ]
}),
new RadioQuestion({
  key: 'fonctionnaireInternational',
  code: '1403',
  categorie: Categorie.COMPLEMENTS,
  subcategorie: Subcategorie.SITUATION_FISCALE,
  help: true,
  inline: true,
  options: Object.keys(ReponseProgressive).map(label => ({label: label})),
  altText: value => hasConjoint(value) ? 'avecConjoint' : null,
  skip: (value: any) => isRefugie(value),
  eligibilite: [
    {
      prestation: Prestation.BOURSES,
      isEligible: (value: any) => !isFonctionnaireInternational(value)
    }
  ]
}),
new RadioQuestion({
  key: 'parentsHabiteFranceTravailleSuisse',
  code: '1404',
  categorie: Categorie.COMPLEMENTS,
  subcategorie: Subcategorie.SITUATION_FISCALE,
  help: true,
  inline: true,
  options: Object.keys(ReponseProgressive).map(label => ({label: label})),
  skip: (value: any) => !hasPermisBEtudes(value),
  eligibilite: [
    {
      prestation: Prestation.BOURSES,
      isEligible: (value: any) => value['parentsHabiteFranceTravailleSuisse'] !== ReponseProgressive.NON
    }
  ]
})*/

