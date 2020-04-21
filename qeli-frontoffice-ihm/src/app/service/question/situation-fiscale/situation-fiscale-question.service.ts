import { Injectable } from '@angular/core';
import { QuestionLoader, QuestionUtils } from '../question-loader';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { Categorie, QeliQuestionDecorator, Subcategorie } from '../qeli-question-decorator.model';
import { Eligibilite, EligibiliteGroup, EligibiliteRefusee } from '../eligibilite.model';
import { MembreFamille, Personne, Relation } from '../../configuration/demandeur.model';
import { RadioQuestion } from '../../../dynamic-question/radio-question/radio-question.model';
import { ReponseProgressive } from '../reponse-binaire.model';
import { Prestation } from '../../configuration/prestation.model';
import { FormData } from '../../../dynamic-question/model/question.model';
import { CheckboxGroupAnswer } from '../../../dynamic-question/checkbox-group-question/checkbox-group-question.model';

@Injectable({
  providedIn: 'root'
})
export class SituationFiscaleQuestionService implements QuestionLoader {

  loadQuestions(configuration: QeliConfiguration, eligibilites: Eligibilite[]): QeliQuestionDecorator<any>[] {
    const eligibiliteGroup = new EligibiliteGroup(eligibilites);
    const membres = ([eligibiliteGroup.demandeur] as (Personne)[]).concat(
      eligibiliteGroup.demandeur.membresFamille
    ).filter(membre =>
             (membre as MembreFamille).relation === Relation.CONCUBIN
          || (membre as MembreFamille).relation === Relation.EPOUX
          || (membre as MembreFamille).relation === Relation.PARTENAIRE_ENREGISTRE
    );
    return membres.map((membre): QeliQuestionDecorator<any>[] => {
      const translateParams = {who: membre.id === 0 ? 'me' : 'them', membre: membre.prenom};
      return [
        {
          question: new RadioQuestion({
            key: `exempteImpot_${membre.id}`,
            help: {
              key: 'question.exempteImpot.help',
              parameters: translateParams
            },
            dataCyIdentifier: `1401_exempteImpot_${membre.id}`,
            label: {
              key: 'question.exempteImpot.label',
              parameters: translateParams
            },
            radioOptions: Object.keys(ReponseProgressive).map(reponse => ({
              value: reponse,
              label: {key: `common.reponseProgressive.${reponse}`}
            })),
          }),
          calculateRefus: this.calculateExemptionImpotsRefusFn(membre),
          eligibilites: eligibiliteGroup.findByPrestationEtMembre([
            Prestation.BOURSES], membre),
          categorie: Categorie.SITUATION_PERSONELLE,
          subcategorie: Subcategorie.SITUATION_FISCALE
        }
      ];
    }).reduce((result, current) => result.concat(current), []);
  }

    private calculateExemptionImpotsRefusFn(membre: Personne) {
      return (formData: FormData, eligibilites: Eligibilite[]): EligibiliteRefusee[] => {
        const situationRenteAnswer = formData[`exempteImpot_${membre.id}`] as CheckboxGroupAnswer;

        if (situationRenteAnswer.none.value === 'OUI') {
          return QuestionUtils.createRefusByPrestation(
            // Refus PC AVS AI si aucune des options n'est pas coché.
            eligibilites, Prestation.SUBSIDES, eligibilite => ({
              key: `question.exempteImpot.motifRefus.${eligibilite.prestation}`,
              parameters: {who: membre.id === 0 ? 'me' : 'them', membre: membre.prenom}
            })
          );
        }
        return [];
      };
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

