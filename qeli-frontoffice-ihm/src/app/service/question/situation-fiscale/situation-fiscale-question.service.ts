import { Injectable } from '@angular/core';
import { QuestionLoader } from '../question-loader';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { Categorie, QeliQuestionDecorator, Subcategorie } from '../qeli-question-decorator.model';
import { Eligibilite, EligibiliteGroup, EligibiliteRefusee } from '../eligibilite.model';
import { Personne } from '../../configuration/demandeur.model';
import { Prestation } from '../../configuration/prestation.model';
import { REPONSE_PROGRESSIVE_OPTIONS, ReponseProgressive } from '../reponse-binaire.model';
import { RadioQuestion } from '../../../dynamic-question/radio-question/radio-question.model';
import { FormData } from '../../../dynamic-question/model/question.model';
import { OptionAnswer } from '../../../dynamic-question/model/answer.model';
import { RequerantRefugie } from '../nationalite/requerant-refugie.model';
import {
  CompositeAnswer, CompositeQuestion
} from '../../../dynamic-question/composite-question/composite-question.model';
import { element } from 'protractor';

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
          question: new CompositeQuestion({
            key: `fonctionnaireInternational`,
            dataCyIdentifier: `1403_fonctionnaireInternational`,
            label: {
              key: 'question.fonctionnaireInternational.label',
              parameters: {numberOfMemebres: eligibiliteGroup.demandeur.membresFamille.length}
            },
            items: membres.map(membre => ({
              question: new RadioQuestion({
                key: `fonctionnaireInternational_${membre.id}`,
                help: {
                  key: 'question.fonctionnaireInternational.help',
                  parameters: {who: membre.id === 0 ? 'me' : 'them', membre: membre.prenom}
                },
                dataCyIdentifier: `1403_fonctionnaireInternational_${membre.id}`,
                label: {
                  key: 'question.fonctionnaireInternational.membre',
                  parameters: {
                    who: membre.id === 0 ? 'me' : 'them',
                    membre: membre.prenom
                  }
                },
                errorLabels: {required: {key: 'question.fonctionnaireInternational.error.required'}},
                inline: true,
                radioOptions: REPONSE_PROGRESSIVE_OPTIONS,
              }),
              isShown: (value: any) => {
                const situation = value[`situationMembre_${membre.id}`];
                const refugie = situation ? situation[`refugie_${membre.id}`] : null;
                return refugie !== RequerantRefugie.REFUGIE;
              }
            }))
          }),
          calculateRefus: this.calculatefonctionnaireInternationalRefusFn,
          eligibilites: eligibiliteGroup.findByPrestation(Prestation.BOURSES),
          categorie: Categorie.SITUATION_PERSONELLE,
          subcategorie: Subcategorie.SITUATION_FISCALE,
          skip: formData => membres.every(membre => { const situation = formData[`situationMembre_${membre.id}`];
                                                    const refugie = situation ? situation[`refugie_${membre.id}`] : null;
                                                    return refugie === RequerantRefugie.REFUGIE; })

        }
      ];
  }

  private calculatefonctionnaireInternationalRefusFn(formData: FormData, eligibilites: Eligibilite[]): EligibiliteRefusee[] {
    const answers = (formData['fonctionnaireInternational'] as CompositeAnswer).answers;
    const eligibiliteGroup = new EligibiliteGroup(eligibilites);

    return eligibiliteGroup.findByPrestation(Prestation.BOURSES).filter(eligibilite => {
      const answer = (answers[`fonctionnaireInternational_${eligibilite.membre.id}`] as OptionAnswer<string>);
      const choice = answer ? answer.value : null;
      return choice && choice.value === ReponseProgressive.OUI;
    }).map(eligibilite => ({
      eligibilite: eligibilite,
        motif: {
        key: `question.fonctionnaireInternational.motifRefus.${Prestation.BOURSES}`,
          parameters: {
          who: eligibilite.membre.id === 0 ? 'me' : 'them',
            membre: eligibilite.membre.prenom
        }
      }
    }));
    /* return (formData: FormData, eligibilites: Eligibilite[]): EligibiliteRefusee[] => {
      const choosenOption = (formData[`fonctionnaireInternational_${membre.id}`] as OptionAnswer<string>).value;

      if (choosenOption.value === ReponseProgressive.OUI) {
        QuestionUtils.createRefusByPrestationAndMembre(
          eligibilites, Prestation.BOURSES, membre, eligibilite => ({
            key: `question.fonctionnaireInternational.motifRefus.${eligibilite.prestation}`,
            parameters: {who: membre.id === 0 ? 'me' : 'them', membre: membre.prenom}
          }));
      }
      return [];
    };*/
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
          key: 'm',
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
