import { Injectable } from '@angular/core';
import { QuestionLoader } from '../question-loader';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { TypeRevenus } from './revenus.model';
import { Categorie, QeliQuestionDecorator, Subcategorie } from '../qeli-question-decorator.model';
import { Eligibilite, EligibiliteGroup, EligibiliteRefusee } from '../eligibilite.model';
import {
  CheckboxGroup, CheckboxGroupAnswer, CheckboxGroupQuestion
} from '../../../dynamic-question/checkbox-group-question/checkbox-group-question.model';
import { Demandeur, MembreFamille, Relation } from '../../configuration/demandeur.model';
import { FormData, QuestionOption } from '../../../dynamic-question/model/question.model';
import { Prestation } from '../../configuration/prestation.model';
import { OptionAnswer, StringAnswer } from '../../../dynamic-question/model/answer.model';

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
                  membre.relation === Relation.CONCUBIN ||
                  membre.relation === Relation.ENFANT
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
              key: 'question.revenusConjoint.label'
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
              },
              {value: 'INCONNU', label: {key: 'question.prestations.inconnu'}}
            ],
            checkboxOptions: REVENUS_OPTIONS.map(revenuOption => {
              const options = !!revenuOption.options
                ? revenuOption.options.map(option => { return {value: option.label, label: {key: `question.revenusConjoint.option.${option.label}`}} as QuestionOption<string>; })
                : null;

              const text = !!revenuOption.help
                ? {key: `question.revenusConjoint.option.${revenuOption.label}.label`, help: `question.revenusConjoint.option.${revenuOption.label}.help`}
                : {key: `question.revenusConjoint.option.${revenuOption.label}`};

              return !!options
                ? {label: text, options: options} as CheckboxGroup
                : {label: text, value: revenuOption.label } as QuestionOption<string>;
            })
          }),
          calculateRefus: this.calculateRevenusRefusFn(membre),
          eligibilites: eligibiliteGroup.findByPrestationEtMembre([Prestation.PC_FAM,
                                                                   Prestation.AIDE_SOCIALE,
                                                                   Prestation.PC_AVS_AI,
                                                                   Prestation.BOURSES], membre),
          categorie: Categorie.SITUATION_PERSONELLE,
          subcategorie: Subcategorie.REVENUS
        },
        {
          question: new CheckboxGroupQuestion({
            key: `revenusEnfants_${membre.id}`,
            dataCyIdentifier: `0602_revenusEnfants_${membre.id}`,
            label: {
              key: 'question.revenusEnfants.label',
              parameters: translateParams
            },
            noneOptions: [
              {
                value: 'OUI',
                label: {
                  key: 'question.revenusEnfants.none'
                }
              },
              {
                value: 'NON',
                label: {
                  key: 'question.revenusEnfants.some'
                }
              },
              {value: 'INCONNU', label: {key: 'question.prestations.inconnu'}}
            ],
            checkboxOptions: REVENUS_OPTIONS.map(revenuOption => {
              const options = !!revenuOption.options
                              ? revenuOption.options.map(option => { return {value: option.label, label: {key: `question.revenusEnfants.option.${option.label}`}} as QuestionOption<string>; })
                              : null;

              const text = !!revenuOption.help
                           ? {key: `question.revenusEnfants.option.${revenuOption.label}.label`, help: `question.revenusEnfants.option.${revenuOption.label}.help`}
                           : {key: `question.revenusEnfants.option.${revenuOption.label}`};

              return !!options
                     ? {label: text, options: options} as CheckboxGroup
                     : {label: text, value: revenuOption.label } as QuestionOption<string>;
            })
          }),
          calculateRefus: this.calculateRevenusRefusEnfantsFn(membre),
          eligibilites: eligibiliteGroup.findByPrestationEtMembre([Prestation.PC_AVS_AI, Prestation.BOURSES], membre),
          categorie: Categorie.SITUATION_PERSONELLE,
          subcategorie: Subcategorie.REVENUS
        }
      ];
    }).reduce((result, current) => result.concat(current), []);
  }

  calculateRevenusRefusFn(membre: MembreFamille | Demandeur) {
    return (formData: FormData, eligibilites: Eligibilite[]): EligibiliteRefusee[] => {
      const refus: EligibiliteRefusee[] = [];
      const revenusConjointAnswer = formData[`revenusConjoint_${membre.id}`] as CheckboxGroupAnswer;
      const choices = revenusConjointAnswer.choices;

      if (choices.some(choice => choice.value === 'AVS' || choice.value === 'AI')) {
        this.createRefusByPrestation(
          [Prestation.PC_FAM, Prestation.AIDE_SOCIALE], refus, eligibilites, 'revenusConjoint', membre
        ).forEach(eligibiliteRefusee => refus.push(eligibiliteRefusee));
      }

      if (choices.some(choice => choice.value === 'CHOMAGE' || choice.value === 'AVS_RETRAITE' || choice.value === 'AI_INVALIDITE')) {
        this.createRefusByPrestation(
          [Prestation.PC_FAM, Prestation.AIDE_SOCIALE], refus, eligibilites, 'revenusConjoint', membre
        ).forEach(eligibiliteRefusee => refus.push(eligibiliteRefusee));
      }

      return [];
    };
  }

  calculateRevenusRefusEnfantsFn(membre: MembreFamille | Demandeur) {
    return (formData: FormData, eligibilites: Eligibilite[]): EligibiliteRefusee[] => {
      const refus: EligibiliteRefusee[] = [];
      const revenusEnfantsAnswer = formData[`revenusEnfants_${membre.id}`] as CheckboxGroupAnswer;
      const choices = revenusEnfantsAnswer.choices;

      if (choices.some(choice => choice.value !== 'AVS' && choice.value !== 'AI')) {
        this.createRefusByPrestation(
          [Prestation.PC_AVS_AI], refus, eligibilites, 'revenusEnfants', membre
        ).forEach(eligibiliteRefusee => refus.push(eligibiliteRefusee));
      }

      if (choices.some(choice => choice.value === 'CHOMAGE' || choice.value === 'AVS_RETRAITE' || choice.value === 'AI_INVALIDITE')) {
        this.createRefusByPrestation(
          [Prestation.BOURSES], refus, eligibilites, 'revenusEnfants', membre
        ).forEach(eligibiliteRefusee => refus.push(eligibiliteRefusee));
      }

      return [];
    };
  }

  private createRefusByPrestation(prestations: Prestation[],
                                  refus: EligibiliteRefusee[],
                                  eligibilites: Eligibilite[], key, membre: MembreFamille | Demandeur) {
    const translateParams = {who: membre.id === 0 ? 'me' : 'them', membre: membre.prenom};
    const eligibiliteGroup = new EligibiliteGroup(eligibilites);

    prestations.forEach(prestation => {
      eligibiliteGroup.findByPrestationEtMembre(prestation, membre).forEach(eligibilite => {
        refus.push({
          eligibilite: eligibilite,
          motif: {
            key: `question.${key}.motifRefus.${eligibilite.prestation}`,
            parameters: translateParams
          }
        });
      });
    });

    return refus;
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
