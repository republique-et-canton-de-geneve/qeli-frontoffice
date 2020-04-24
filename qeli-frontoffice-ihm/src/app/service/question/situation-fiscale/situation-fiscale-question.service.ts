import { Injectable } from '@angular/core';
import { QuestionLoader, QuestionUtils } from '../question-loader';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { Categorie, QeliQuestionDecorator, Subcategorie } from '../qeli-question-decorator.model';
import { Eligibilite, EligibiliteGroup, EligibiliteRefusee } from '../eligibilite.model';
import { Demandeur, Personne } from '../../configuration/demandeur.model';
import {
  CompositeAnswer, CompositeQuestion
} from '../../../dynamic-question/composite-question/composite-question.model';
import { RadioQuestion } from '../../../dynamic-question/radio-question/radio-question.model';
import { REPONSE_PROGRESSIVE_OPTIONS, ReponseProgressive } from '../reponse-binaire.model';
import { RequerantRefugie } from '../nationalite/requerant-refugie.model';
import { Prestation } from '../../configuration/prestation.model';
import { AnswerUtils } from '../answer-utils';
import { OptionAnswer } from '../../../dynamic-question/model/answer.model';
import { FormData } from '../../../dynamic-question/model/question.model';
import * as moment from 'moment';
import { I18nString } from '../../../core/i18n/i18nstring.model';
import { TypeEnfant } from '../enfants/type-enfant.model';

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
          key: `taxeOfficeAFC`,
          dataCyIdentifier: `1402_taxeOfficeAFC`,
          label: (value: any) => {
            const hasPartenaire = eligibiliteGroup.demandeur.hasConjoint || (
              eligibiliteGroup.demandeur.hasConcubin &&
              this.hasEnfantEnCommun(value, eligibiliteGroup.demandeur)
            );
            return {
              key: 'question.taxeOfficeAFC.label',
              parameters: {
                hasPartenaire: hasPartenaire ? 'yes' : 'no',
                partenaire: hasPartenaire ? eligibiliteGroup.demandeur.partenaire.prenom : '',
                annee: moment().subtract(configuration.taxationAfcYearsFromNow, 'year').get('year')
              }
            } as I18nString;
          },
          help: {key: 'question.taxeOfficeAFC.help'},
          errorLabels: {required: {key: 'question.taxeOfficeAFC.error.required'}},
          inline: true,
          radioOptions: REPONSE_PROGRESSIVE_OPTIONS
        }),
        calculateRefus: QuestionUtils.rejectPrestationByOptionAnswerFn(
          'taxeOfficeAFC',
          ReponseProgressive.OUI,
          Prestation.SUBSIDES,
          eligibilite => ({key: `question.taxeOfficeAFC.motifRefus.${eligibilite.prestation}`})
        ),
        eligibilites: eligibiliteGroup.findByPrestation(Prestation.SUBSIDES),
        categorie: Categorie.COMPLEMENTS,
        subcategorie: Subcategorie.SITUATION_FISCALE
      },
      {
        question: new CompositeQuestion({
          key: `fonctionnaireInternational`,
          dataCyIdentifier: `1403_fonctionnaireInternational`,
          label: {
            key: 'question.fonctionnaireInternational.label',
            parameters: {numberOfMemebres: eligibiliteGroup.demandeur.membresFamille.length}
          },
          showErrors: false,
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
              radioOptions: REPONSE_PROGRESSIVE_OPTIONS
            }),
            isShown: (value: any) => {
              const situation = value[`situationMembre_${membre.id}`];
              const refugie = situation ? situation[`refugie_${membre.id}`] : null;
              return refugie !== RequerantRefugie.REFUGIE;
            }
          }))
        }),
        eligibilites: eligibiliteGroup.findByPrestation(Prestation.BOURSES),
        skip: formData => membres.every(membre => AnswerUtils.isRefugie(formData, membre)),
        calculateRefus: this.calculateFonctionnaireInternationalRefus,
        categorie: Categorie.SITUATION_PERSONELLE,
        subcategorie: Subcategorie.SITUATION_FISCALE
      }, {
        question: new CompositeQuestion({
          key: 'parentsHabiteFranceTravailleSuisse',
          dataCyIdentifier: '1404_parentsHabiteFranceTravailleSuisse',
          label: {key: 'question.parentsHabiteFranceTravailleSuisse.label'},
          help: {key: 'question.parentsHabiteFranceTravailleSuisse.help'},
          showErrors: false,
          items: membres.map(membre => {
            const translateParams = {
              who: membre.id === 0 ? 'me' : 'them',
              membre: membre.prenom
            };

            return {
              question: new RadioQuestion({
                key: `parentsHabiteFranceTravailleSuisse_${membre.id}`,
                dataCyIdentifier: `1404_parentsHabiteFranceTravailleSuisse_${membre.id}`,
                label: {key: 'question.parentsHabiteFranceTravailleSuisse.membre', parameters: translateParams},
                errorLabels: {
                  required: {key: 'question.parentsHabiteFranceTravailleSuisse.error.required'}
                },
                radioOptions: REPONSE_PROGRESSIVE_OPTIONS,
                inline: true
              }),
              isShown: (value: any) => {
                const answers = value['permisBEtudes'];
                const permisBEtudes = answers ? answers[`permisBEtudes_${membre.id}`] : null;
                return permisBEtudes && permisBEtudes === ReponseProgressive.OUI;
              }
            };
          })
        }),
        eligibilites: eligibiliteGroup.findByPrestation(Prestation.BOURSES),
        skip: formData => {
          return !membres.some(membre => {
            return AnswerUtils.hasPermisBEtudes(formData, membre);
          });
        },
        calculateRefus: this.calculateRefusParentsHabiteFranceTravailleSuisse,
        categorie: Categorie.COMPLEMENTS,
        subcategorie: Subcategorie.SITUATION_FISCALE
      }
    ];
  }

  private hasEnfantEnCommun(value: any, demandeur: Demandeur) {
    const answers = value['parentsEnfants'];
    return demandeur.enfants.some(membre => answers[`parentsEnfants_${membre.id}`] === TypeEnfant.LES_DEUX);
  }

  private calculateFonctionnaireInternationalRefus(
    formData: FormData, eligibilites: Eligibilite[]
  ): EligibiliteRefusee[] {
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
  }

  private calculateRefusParentsHabiteFranceTravailleSuisse(
    formData: FormData, eligibilites: Eligibilite[]
  ): EligibiliteRefusee[] {
    const eligibiliteGroup = new EligibiliteGroup(eligibilites);
    const answers = (formData[`parentsHabiteFranceTravailleSuisse`] as CompositeAnswer).answers;

    return eligibiliteGroup.findByPrestation(Prestation.BOURSES).filter(eligibilite => {
      const answer = (answers[`parentsHabiteFranceTravailleSuisse_${eligibilite.membre.id}`] as OptionAnswer<string>);
      const choice = answer ? answer.value : null;
      return choice && choice.value === ReponseProgressive.NON;
    }).map(eligibilite => ({
      eligibilite: eligibilite,
      motif: {
        key: `question.parentsHabiteFranceTravailleSuisse.motifRefus.${eligibilite.prestation}`,
        parameters: {who: eligibilite.membre.id === 0 ? 'me' : 'them', membre: eligibilite.membre.prenom}
      }
    } as EligibiliteRefusee));
  }
}
