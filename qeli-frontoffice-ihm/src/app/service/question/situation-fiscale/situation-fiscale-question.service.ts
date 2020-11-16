import { QuestionLoader } from '../question-loader';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { Categorie, QeliQuestionDecorator, Subcategorie } from '../qeli-question-decorator.model';
import { Eligibilite, EligibiliteGroup, EligibiliteRefusee } from '../eligibilite.model';
import { Personne } from '../../configuration/demandeur.model';
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
import { QuestionUtils } from '../qeli-questions.utils';

export class SituationFiscaleQuestionService extends QuestionLoader {
  loadQuestions(configuration: QeliConfiguration): QeliQuestionDecorator<any>[] {
    const eligibiliteGroup = new EligibiliteGroup(this.demandeur.toEligibilite(), this.demandeur);
    const membres = ([this.demandeur] as (Personne)[]).concat(this.demandeur.membresFamille);
    const generateTranslateParams = (value: any) => {
      const hasPartenaire = this.demandeur.hasConjoint || (
        this.demandeur.hasConcubin && this.hasEnfantEnCommun(value)
      );
      return {
        hasPartenaire: hasPartenaire ? 'yes' : 'no',
        partenaire: hasPartenaire ? this.demandeur.partenaire.prenom : '',
        annee: moment().subtract(configuration.taxationAfcYearsFromNow, 'year').get('year')
      };
    };
    return [
      {
        question: new RadioQuestion({
          key: `exempteImpot`,
          dataCyIdentifier: `1401_exempteImpot`,
          label: (value: any) => {
            return {
              key: 'question.exempteImpot.label',
              parameters: generateTranslateParams(value)
            } as I18nString;
          },
          help: {key: 'question.exempteImpot.help'},
          errorLabels: {required: {key: 'question.exempteImpot.error.required'}},
          inline: true,
          radioOptions: REPONSE_PROGRESSIVE_OPTIONS
        }),
        calculateRefus: QuestionUtils.rejectPrestationByOptionAnswerFn(
          'exempteImpot',
          ReponseProgressive.OUI,
          Prestation.SUBSIDES,
          this.demandeur,
          eligibilite => ({key: `question.exempteImpot.motifRefus.${eligibilite.prestation}`})
        ),
        eligibilites: eligibiliteGroup.findByPrestation(Prestation.SUBSIDES),
        categorie: Categorie.COMPLEMENTS,
        subcategorie: Subcategorie.SITUATION_FISCALE
      },
      {
        question: new RadioQuestion({
          key: `taxeOfficeAFC`,
          dataCyIdentifier: `1402_taxeOfficeAFC`,
          label: (value: any) => {
            return {
              key: 'question.taxeOfficeAFC.label',
              parameters: generateTranslateParams(value)
            } as I18nString;
          },
          help: (value: any) => {
            return {
              key: 'question.taxeOfficeAFC.help',
              parameters: generateTranslateParams(value)
            } as I18nString;
          },
          errorLabels: {required: {key: 'question.taxeOfficeAFC.error.required'}},
          inline: true,
          radioOptions: REPONSE_PROGRESSIVE_OPTIONS
        }),
        calculateRefus: QuestionUtils.rejectPrestationByOptionAnswerFn(
          'taxeOfficeAFC',
          ReponseProgressive.OUI,
          Prestation.SUBSIDES,
          this.demandeur,
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
            parameters: {numberOfMemebres: this.demandeur.membresFamille.length}
          },
          help: {key: 'question.fonctionnaireInternational.help'},
          showErrors: false,
          items: membres.map(membre => ({
            question: new RadioQuestion({
              key: `fonctionnaireInternational_${membre.id}`,
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
              const refugie = situation ? situation['refugie'] : null;
              return refugie !== RequerantRefugie.REFUGIE;
            }
          }))
        }),
        eligibilites: eligibiliteGroup.findByPrestation(Prestation.BOURSES),
        skip: formData => membres.every(membre => AnswerUtils.isRefugie(formData, membre)),
        calculateRefus: this.calculateFonctionnaireInternationalRefus.bind(this),
        categorie: Categorie.COMPLEMENTS,
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
                errorLabels: {required: {key: 'question.parentsHabiteFranceTravailleSuisse.error.required'}},
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
        calculateRefus: this.calculateRefusParentsHabiteFranceTravailleSuisse.bind(this),
        categorie: Categorie.COMPLEMENTS,
        subcategorie: Subcategorie.SITUATION_FISCALE
      }
    ];
  }

  private hasEnfantEnCommun(value: any) {
    const answers = value['parentsEnfants'];
    return this.demandeur.enfants.some(membre => answers[`parentsEnfants_${membre.id}`] === TypeEnfant.LES_DEUX);
  }

  private calculateFonctionnaireInternationalRefus(
    formData: FormData, eligibilites: Eligibilite[]
  ): EligibiliteRefusee[] {
    const answers = (formData['fonctionnaireInternational'] as CompositeAnswer).answers;
    const eligibiliteGroup = new EligibiliteGroup(eligibilites, this.demandeur);

    return eligibiliteGroup.findByPrestation(Prestation.BOURSES).filter(eligibilite => {
      const answer = (answers[`fonctionnaireInternational_${eligibilite.membreId}`] as OptionAnswer<string>);
      const choice = answer ? answer.value : null;
      return choice && choice.value === ReponseProgressive.OUI;
    }).map(eligibilite => ({
      eligibilite: eligibilite,
      motif: {
        key: `question.fonctionnaireInternational.motifRefus.${Prestation.BOURSES}`,
        parameters: {
          who: eligibilite.membreId === 0 ? 'me' : 'them',
          membre: this.demandeur.findMembrebyId(eligibilite.membreId).prenom
        }
      }
    }));
  }

  private calculateRefusParentsHabiteFranceTravailleSuisse(
    formData: FormData, eligibilites: Eligibilite[]
  ): EligibiliteRefusee[] {
    const eligibiliteGroup = new EligibiliteGroup(eligibilites, this.demandeur);
    const answers = (formData[`parentsHabiteFranceTravailleSuisse`] as CompositeAnswer).answers;

    return eligibiliteGroup.findByPrestation(Prestation.BOURSES).filter(eligibilite => {
      const answer = (answers[`parentsHabiteFranceTravailleSuisse_${eligibilite.membreId}`] as OptionAnswer<string>);
      const choice = answer ? answer.value : null;
      return choice && choice.value === ReponseProgressive.NON;
    }).map(eligibilite => ({
      eligibilite: eligibilite,
      motif: {
        key: `question.parentsHabiteFranceTravailleSuisse.motifRefus.${eligibilite.prestation}`,
        parameters: {
          who: eligibilite.membreId === 0 ? 'me' : 'them',
          membre: this.demandeur.findMembrebyId(eligibilite.membreId).prenom
        }
      }
    } as EligibiliteRefusee));
  }
}
