import { Injectable } from '@angular/core';
import { QuestionLoader } from '../question-loader';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { TypeRevenus } from './revenus.model';
import { Categorie, QeliQuestionDecorator, Subcategorie } from '../qeli-question-decorator.model';
import { Eligibilite, EligibiliteGroup, EligibiliteRefusee } from '../eligibilite.model';
import {
  CheckboxGroup,
  CheckboxGroupAnswer, CheckboxGroupQuestion
} from '../../../dynamic-question/checkbox-group-question/checkbox-group-question.model';
import { Demandeur, MembreFamille, Relation } from '../../configuration/demandeur.model';
import { FormData, QuestionOption } from '../../../dynamic-question/model/question.model';
import { Prestation } from '../../configuration/prestation.model';

const REVENUS_OPTIONS = [
  {label: TypeRevenus.EMPLOI},
  {label: TypeRevenus.CHOMAGE},
  {
    label: 'AVS', options: [
      {label: TypeRevenus.AVS_RETRAITE},
      {label: TypeRevenus.AVS_VEUF},
      {label: TypeRevenus.AVS_ENFANT}
    ]
  },

  {
    label: 'AI', options: [
      {label: TypeRevenus.AI_ENFANT},
      {label: TypeRevenus.AI_INVALIDITE}
    ]
  },
  {label: TypeRevenus.APG, help: true}
];


@Injectable({
  providedIn: 'root'
})
export class RevenusQuestionService implements QuestionLoader {

  loadQuestions(configuration: QeliConfiguration, eligibilites: Eligibilite[]): QeliQuestionDecorator<any>[] {

    const eligibiliteGroup = new EligibiliteGroup(eligibilites);
    const membres = ([eligibiliteGroup.demandeur] as (MembreFamille | Demandeur)[]).concat(
      eligibiliteGroup.demandeur.membresFamille.filter(
        membre => membre.relation === Relation.PARTENAIRE_ENREGISTRE ||
                  membre.relation === Relation.EPOUX ||
                  membre.relation === Relation.CONCUBIN
      )
    );

    return membres.map((membre): QeliQuestionDecorator<any>[] => {
      const translateParams = {who: membre.id === 0 ? 'me' : 'them', membre: membre.prenom};
      return [
        {
          question: new CheckboxGroupQuestion({
            key: `revenusConjoint_${membre.id}`,
            dataCyIdentifier: `0602_revenusConjoint_${membre.id}`,
            label: {
              key: 'queston.revenusConjoint.label'
            },
            noneOptions: [
              {
                value: 'OUI',
                label: {
                  key: 'question.revenusConjoint.none'
                }
              },
              {
                value: 'NON',
                label: {
                  key: 'question.revenusConjoint.some'
                }
              }
            ],
            checkboxOptions: REVENUS_OPTIONS.map(revenuOption => {
              const options = !!revenuOption.options ? revenuOption.options.map(option => { return {value: option.label, label: {key: `question.revenusConjoint.option.${option.label}`}} as QuestionOption<string>; }) : null;
              return !!options ? {label: {key: `question.revenusConjoint.option.${revenuOption.label}`}, options: options } as CheckboxGroup : {label: {key: ''} } as CheckboxGroup;
            })
          }),
          calculateRefus: this.calculateRevenusRefusFn(membre),
          eligibilites: eligibiliteGroup.findByPrestationEtMembre([Prestation.PC_FAM,
                                                                   Prestation.AIDE_SOCIALE,
                                                                   Prestation.PC_AVS_AI,
                                                                   Prestation.BOURSES], membre),
          categorie: Categorie.SITUATION_PERSONELLE,
          subcategorie: Subcategorie.REVENUS
        }
      ];
    }).reduce((result, current) => result.concat(current), []);
  }

  calculateRevenusRefusFn(membre: MembreFamille | Demandeur) {
    return (formData: FormData, eligibilites: Eligibilite[]): EligibiliteRefusee[] => {
      const refus: EligibiliteRefusee[] = null;
      const revenusAnswer = formData['prestations'] as CheckboxGroupAnswer;
      const choices = revenusAnswer.choices;

      if (choices.some(choice => choice.value === 'AVS' || choice.value === 'AI')) {
        this.createRefusByPrestation(
          [Prestation.PC_FAM, Prestation.AIDE_SOCIALE], refus, eligibilites
        ).forEach(eligibiliteRefusee => refus.push(eligibiliteRefusee));
      }

      if (choices.some(choice => choice.value === 'CHOMAGE' || choice.value === 'AVS_RETRAITE' || choice.value === 'AI_INVALIDITE')) {
        this.createRefusByPrestation(
          [Prestation.PC_FAM, Prestation.AIDE_SOCIALE], refus, eligibilites
        ).forEach(eligibiliteRefusee => refus.push(eligibiliteRefusee));
      }

      return [];
    };
  }

  //TODO : Duplicate from prestation-question.service -> maybe refactor to a question.util ?
  private createRefusByPrestation(prestations: Prestation[],
                                  refus: EligibiliteRefusee[],
                                  eligibilites: Eligibilite[]) {
    return eligibilites.filter(eligibilite => prestations.includes(eligibilite.prestation))
                       .filter(eligibilite => !this.isEligibiliteRefusee(refus, eligibilite))
                       .map(eligibilite => ({
                         eligibilite: eligibilite,
                         motif: {key: `question.revenusConjoint.motifRefus.${eligibilite.prestation}`}
                       } as EligibiliteRefusee));
  }

  private isEligibiliteRefusee(refus: EligibiliteRefusee[], eligibilite: Eligibilite) {
    return new EligibiliteGroup(refus.map(refus => refus.eligibilite)).includes(eligibilite);
  }

      /*
      new CheckboxGroupQuestion({
        key: 'revenus',
        code: '0601',
        categorie: Categorie.SITUATION_PERSONELLE,
        subcategorie: Subcategorie.REVENUS,
        hasNone: true,
        options: REVENUS_OPTIONS,
        eligibilite: [
          {
            prestation: Prestation.BOURSES,
            isEligible: (value: any) => !hasAnyRevenus(value, [
              TypeRevenus.CHOMAGE,
              TypeRevenus.AVS_RETRAITE,
              TypeRevenus.AI_INVALIDITE
            ])
          },
          {
            prestation: Prestation.PC_AVS_AI,
            isEligible: (value: any) => hasAnyAVSOrAIRevenus(value) ||
                                        !isPaysNonConventione(value)
          },
          {
            prestation: Prestation.PC_FAM,
            isEligible: (value: any) => !hasAnyAVSOrAIRevenus(value)
          },
          {
            prestation: Prestation.AIDE_SOCIALE,
            isEligible: (value: any) => !hasAnyAVSOrAIRevenus(value)
          }
        ]
      }),
      new CheckboxGroupQuestion({
        key: 'situationRente',
        code: '0805',
        categorie: Categorie.SITUATION_PERSONELLE,
        subcategorie: Subcategorie.REVENUS,
        hasNone: true,
        options: [
          {label: SituationRente.RECONNU_OCAI, help: true},
          {label: SituationRente.RETRAITE_SANS_RENTE},
          {label: SituationRente.VEUF_SANS_RENTE}
        ],
        skip: (value: any) => hasAnyAVSOrAIRevenus(value),
        eligibilite: [
          {
            prestation: Prestation.PC_AVS_AI,
            isEligible: (value: any) => !isSituationRenteNone(value)
          }
        ]
      }),
      new CheckboxGroupQuestion({
        key: 'revenusConjoint',
        code: '0602',
        categorie: Categorie.SITUATION_PERSONELLE,
        subcategorie: Subcategorie.REVENUS,
        hasNone: true,
        options: REVENUS_OPTIONS,
        skip: (value: any, prestationsEligibles: Prestation[]) =>
          !hasConjoint(value) ||
          (
            prestationsEligibles.includes(Prestation.PC_AVS_AI) &&
            !(
              prestationsEligibles.includes(Prestation.PC_FAM) ||
              prestationsEligibles.includes(Prestation.AIDE_SOCIALE)
            )
          ),
        eligibilite: [
          {
            prestation: Prestation.PC_AVS_AI_CONJOINT,
            isEligible: (value: any) => hasAnyAVSOrAIRevenus(value, 'revenusConjoint') ||
                                        !isPaysNonConventione(value, 'nationaliteConjoint')
          },
          {
            prestation: Prestation.PC_FAM,
            isEligible: (value: any) => !hasAnyAVSOrAIRevenus(value, 'revenusConjoint')
          },
          {
            prestation: Prestation.AIDE_SOCIALE,
            isEligible: (value: any) => !hasAnyAVSOrAIRevenus(value, 'revenusConjoint')
          }
        ]
      }),
      new CheckboxGroupQuestion({
        key: 'situationRenteConjoint',
        code: '0806',
        categorie: Categorie.SITUATION_PERSONELLE,
        subcategorie: Subcategorie.REVENUS,
        hasNone: true,
        options: [
          {label: SituationRente.RECONNU_OCAI, help: true},
          {label: SituationRente.RETRAITE_SANS_RENTE}
        ],
        skip: (value: any, prestationsEligibles: Prestation[]) =>
          hasAnyAVSOrAIRevenus(value, 'revenusConjoint') ||
          prestationsEligibles.includes(Prestation.PC_AVS_AI),
        eligibilite: [
          {
            prestation: Prestation.PC_AVS_AI_CONJOINT,
            isEligible: (value: any) => !isSituationRenteNone(value, 'situationRenteConjoint')
          }
        ]
      }),
      new CheckboxGroupQuestion({
        key: 'revenusConcubin',
        code: '0603',
        categorie: Categorie.SITUATION_PERSONELLE,
        subcategorie: Subcategorie.REVENUS,
        hasNone: true,
        options: REVENUS_OPTIONS,
        skip: (value: any) => !isConcubinageAutreParent(value),
        eligibilite: [
          {
            prestation: Prestation.PC_FAM,
            isEligible: (value: any) => !hasAnyAVSOrAIRevenus(value, 'revenusConcubin')
          }
        ]
      }),

      new CheckboxGroupQuestion({
        key: 'revenusEnfant',
        code: '0604',
        categorie: Categorie.SITUATION_PERSONELLE,
        subcategorie: Subcategorie.REVENUS,
        hasNone: true,
        options: REVENUS_OPTIONS,
        skip: (value: any, prestationsEligibles: Prestation[]) =>
          prestationsEligibles.includes(Prestation.PC_AVS_AI) ||
          prestationsEligibles.includes(Prestation.PC_AVS_AI_CONJOINT),
        eligibilite: [
          {
            prestation: Prestation.PC_AVS_AI_ENFANTS,
            isEligible: (value: any) => hasAnyAVSOrAIRevenus(value, 'revenusEnfant') ||
                                        hasAnyEnfantOfType(value, [TypeEnfant.ENTRE_18_25_EN_FORMATION])
          }
        ]
      }),
      new CheckboxGroupQuestion({
        key: 'situationRenteEnfant',
        code: '0807',
        categorie: Categorie.SITUATION_PERSONELLE,
        subcategorie: Subcategorie.REVENUS,
        hasNone: true,
        options: [
          {label: SituationRente.RECONNU_OCAI, help: true}
        ],
        skip: (value: any, prestationsEligibles: Prestation[]) =>
          hasAnyAVSOrAIRevenus(value, 'revenusEnfant') ||
          prestationsEligibles.includes(Prestation.PC_AVS_AI) ||
          prestationsEligibles.includes(Prestation.PC_AVS_AI_CONJOINT),
        eligibilite: [
          {
            prestation: Prestation.PC_AVS_AI_ENFANTS,
            isEligible: (value: any) => !isSituationRenteNone(value, 'situationRenteEnfant')
          }
        ]
      })*/

}
