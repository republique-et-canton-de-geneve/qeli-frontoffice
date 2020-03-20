import {
  CheckboxGroupQuestion, CheckboxGroupValidators
} from '../core/question/checkbox-group-question/checkbox-group-question.model';
import { Prestation } from '../core/common/prestation.model';
import { QuestionBase } from '../core/question/question-base.model';
import { Validators } from '@angular/forms';
import {
  aucuneScolarite, conjointHabiteSuisseDepuis, getLimiteFortune, habiteGeneveDepuis5ans, habiteGeneveDepuisNaissance,
  habiteSuisseDepuis, hasAnyAVSOrAIRevenus, hasAnyEnfantOfType, hasAnyPrestations, hasAnyRevenus, hasConjoint,
  hasEnfants, hasFortuneTropEleve, hasPermisBEtudes, hasPrestation, isApatride, isConcubinageAutreParent,
  isFonctionnaireInternational, isMineur, isPaysNonConventione, isRatioPiecesPersonnesLogementAcceptable, isRefugie,
  isRefugieOrInconnu, isRequerantAsile, isSituationRenteNone, isSuisse, isUEOrAELE, sumTauxActivite,
  sumTauxActiviteAvecConjoint
} from './qeli-questions.utils';
import { DateQuestion, DateQuestionValidators } from '../core/question/date-question/date-question.model';
import * as moment from 'moment';
import { DropdownQuestion } from '../core/question/dropdown-question/dropdown-question.model';
import { EtatCivil } from './model/etat-civil.model';
import { NationaliteQuestion } from '../core/question/nationalite-question/nationalite-question.model';
import { RadioQuestion } from '../core/question/radio-question/radio-question.model';
import { RequerantRefugie } from './model/requerant-refugie.model';
import { ReponseBinaire, ReponseProgressive } from '../core/common/reponse.model';
import { TypeRevenus } from './model/revenus.model';
import { Scolarite } from './model/scolarite.model';
import { Logement } from './model/logement.model';
import { Loyer } from './model/loyer.model';
import { Categorie, Subcategorie } from '../core/question/question-categorie.model';
import {
  NumberField, NumberGroupQuestion, NumberGroupQuestionValidators
} from '../core/question/number-group-question/number-group-question.model';
import { TypeEnfant } from './model/type-enfant.model';
import { SituationRente } from './model/situation-rente.model';
import { NumberQuestion } from '../core/question/number-question/number-question.model';
import { TauxQuestion } from '../core/question/taux-question/taux-question.model';

const PRESTATIONS_OPTIONS = Object.keys(Prestation).filter(
  prestation => prestation !== Prestation.PC_AVS_AI_CONJOINT &&
                prestation !== Prestation.PC_AVS_AI_ENFANTS
);

const PrestationQuestions: QuestionBase<any>[] = [
  new CheckboxGroupQuestion({
    key: 'prestations',
    code: '0101',
    categorie: Categorie.SITUATION_PERSONELLE,
    subcategorie: Subcategorie.PRESTATION,
    help: true,
    hasNone: true,
    hasInconnu: true,
    validators: [
      Validators.required,
      CheckboxGroupValidators.atLeastOneSelected(PRESTATIONS_OPTIONS, true)
    ],
    options: PRESTATIONS_OPTIONS.map(prestation => ({label: prestation})),
    eligibilite: [
      {
        prestation: Prestation.SUBSIDES,
        isEligible: (value: any) => !hasAnyPrestations(
          value, [
            Prestation.SUBSIDES,
            Prestation.PC_AVS_AI,
            Prestation.PC_FAM,
            Prestation.AIDE_SOCIALE
          ]
        )
      },
      {
        prestation: Prestation.AVANCES,
        isEligible: (value: any) => !hasPrestation(value, Prestation.AVANCES)
      },
      {
        prestation: Prestation.ALLOCATION_LOGEMENT,
        isEligible: (value: any) => !hasAnyPrestations(
          value, [
            Prestation.ALLOCATION_LOGEMENT,
            Prestation.SUBVENTION_HM,
            Prestation.PC_AVS_AI
          ]
        )
      },
      {
        prestation: Prestation.PC_AVS_AI,
        isEligible: (value: any) => !hasAnyPrestations(
          value, [
            Prestation.PC_AVS_AI,
            Prestation.PC_FAM
          ]
        )
      },
      {
        prestation: Prestation.PC_AVS_AI_CONJOINT,
        isEligible: (value: any) => !hasAnyPrestations(
          value, [
            Prestation.PC_AVS_AI,
            Prestation.PC_FAM
          ]
        )
      },
      {
        prestation: Prestation.PC_AVS_AI_ENFANTS,
        isEligible: (value: any) => !hasAnyPrestations(
          value, [
            Prestation.PC_AVS_AI,
            Prestation.PC_FAM
          ]
        )
      },
      {
        prestation: Prestation.BOURSES,
        isEligible: (value: any) => !hasPrestation(value, Prestation.BOURSES)
      },
      {
        prestation: Prestation.PC_FAM,
        isEligible: (value: any) => !hasAnyPrestations(
          value, [
            Prestation.PC_AVS_AI,
            Prestation.PC_FAM
          ]
        )
      },
      {
        prestation: Prestation.AIDE_SOCIALE,
        isEligible: (value: any) => !hasPrestation(value, Prestation.AIDE_SOCIALE)
      }
    ]
  })
];

const AgeQuestions: QuestionBase<any>[] = [
  new DateQuestion({
    key: 'dateNaissance',
    code: '0201',
    categorie: Categorie.SITUATION_PERSONELLE,
    subcategorie: Subcategorie.AGE,
    help: true,
    maxDate: new Date(),
    minDate: moment().subtract(130, 'year').toDate(),
    validators: [Validators.required, DateQuestionValidators.atLeastOneSelected()],
    eligibilite: [
      {prestation: Prestation.SUBSIDES},
      {prestation: Prestation.AVANCES},
      {prestation: Prestation.ALLOCATION_LOGEMENT},
      {prestation: Prestation.PC_AVS_AI},
      {prestation: Prestation.BOURSES},
      {prestation: Prestation.PC_FAM},
      {
        prestation: Prestation.AIDE_SOCIALE,
        isEligible: (value: any) => !isMineur(value)
      }
    ]
  })
];

const EtatCivilQuestions: QuestionBase<any>[] = [
  new DropdownQuestion({
    key: 'etatCivil',
    code: '0301',
    categorie: Categorie.SITUATION_PERSONELLE,
    subcategorie: Subcategorie.ETAT_CIVIL,
    help: true,
    options: Object.keys(EtatCivil),
    validators: [Validators.required],
    eligibilite: [
      {
        prestation: Prestation.PC_AVS_AI_CONJOINT,
        isEligible: (value: any) => hasConjoint(value)
      },
      {prestation: Prestation.BOURSES},
      {prestation: Prestation.PC_FAM},
      {prestation: Prestation.AIDE_SOCIALE}
    ]
  }),
  new NumberGroupQuestion({
    key: 'enfantsACharge',
    code: '0505',
    categorie: Categorie.SITUATION_PERSONELLE,
    subcategorie: Subcategorie.ETAT_CIVIL,
    help: true,
    hasNone: true,
    validators: [
      Validators.required,
      NumberGroupQuestionValidators.atLeastOneFilled(Object.keys(TypeEnfant), true)
    ],
    fields: Object.keys(TypeEnfant).map(
      prestation => new NumberField({label: prestation, max: 20, min: 0})
    ),
    eligibilite: [
      {
        prestation: Prestation.PC_FAM,
        isEligible: (value: any) => hasAnyEnfantOfType(value, [
          TypeEnfant.MOINS_18,
          TypeEnfant.ENTRE_18_25_EN_FORMATION
        ])
      },
      {
        prestation: Prestation.PC_AVS_AI_ENFANTS,
        isEligible: (value: any) => hasAnyEnfantOfType(value, [
          TypeEnfant.MOINS_18,
          TypeEnfant.ENTRE_18_25_EN_FORMATION
        ])
      },
      {prestation: Prestation.BOURSES},
      {prestation: Prestation.AIDE_SOCIALE}
    ]
  }),
  new RadioQuestion({
    key: 'concubinageAutreParent',
    code: '0506',
    categorie: Categorie.SITUATION_PERSONELLE,
    subcategorie: Subcategorie.ETAT_CIVIL,
    help: true,
    inline: true,
    skip: (value: any) => hasConjoint(value) || !hasEnfants(value),
    options: Object.keys(ReponseBinaire).map(label => ({label: label})),
    validators: [Validators.required],
    eligibilite: [
      {prestation: Prestation.PC_FAM}
    ]
  })
];

const NationaliteQuestions: QuestionBase<any>[] = [
  new NationaliteQuestion({
    key: 'nationalite',
    code: '0401',
    categorie: Categorie.SITUATION_PERSONELLE,
    subcategorie: Subcategorie.NATIONALITE,
    help: true,
    eligibilite: [
      {prestation: Prestation.PC_AVS_AI},
      {prestation: Prestation.BOURSES}
    ]
  }),
  new RadioQuestion({
    key: 'refugie',
    code: '0402',
    categorie: Categorie.SITUATION_PERSONELLE,
    subcategorie: Subcategorie.NATIONALITE,
    options: [
      {label: RequerantRefugie.REQUERANT_ASILE, help: true},
      {label: RequerantRefugie.REFUGIE, help: true},
      {label: RequerantRefugie.AUCUN},
      {label: RequerantRefugie.INCONNU}
    ],
    validators: [Validators.required],
    skip: (value: any) => isSuisse(value) ||
                          isUEOrAELE(value) ||
                          isApatride(value),
    eligibilite: [
      {prestation: Prestation.PC_AVS_AI},
      {prestation: Prestation.BOURSES}
    ]
  }),
  new NationaliteQuestion({
    key: 'nationaliteConjoint',
    code: '0403',
    categorie: Categorie.SITUATION_PERSONELLE,
    subcategorie: Subcategorie.NATIONALITE,
    skip: (value: any) => !hasConjoint(value),
    help: true,
    eligibilite: [
      {prestation: Prestation.PC_AVS_AI_CONJOINT},
      {prestation: Prestation.BOURSES}
    ]
  }),
  new RadioQuestion({
    key: 'refugieConjoint',
    code: '0404',
    categorie: Categorie.SITUATION_PERSONELLE,
    subcategorie: Subcategorie.NATIONALITE,
    options: [
      {label: RequerantRefugie.REQUERANT_ASILE, help: true},
      {label: RequerantRefugie.REFUGIE, help: true},
      {label: RequerantRefugie.AUCUN},
      {label: RequerantRefugie.INCONNU}
    ],
    validators: [Validators.required],
    skip: (value: any) => !hasConjoint(value) ||
                          isSuisse(value, 'nationaliteConjoint') ||
                          isUEOrAELE(value, 'nationaliteConjoint') ||
                          isApatride(value, 'nationaliteConjoint'),
    eligibilite: [
      {prestation: Prestation.PC_AVS_AI_CONJOINT},
      {prestation: Prestation.BOURSES}
    ]
  }),
  new RadioQuestion({
    key: 'permisBEtudes',
    code: '0405',
    categorie: Categorie.SITUATION_PERSONELLE,
    subcategorie: Subcategorie.NATIONALITE,
    help: true,
    inline: true,
    options: Object.keys(ReponseProgressive).map(label => ({label: label})),
    validators: [Validators.required],
    skip: (value: any) => isSuisse(value) ||
                          isRefugie(value) ||
                          isRequerantAsile(value) ||
                          isApatride(value),
    eligibilite: [
      {prestation: Prestation.BOURSES}
    ]
  })
];

const DomicileQuestions: QuestionBase<any>[] = [
  new RadioQuestion({
    key: 'domicileCantonGE',
    code: '0501',
    categorie: Categorie.SITUATION_PERSONELLE,
    subcategorie: Subcategorie.DOMICILE,
    help: true,
    inline: true,
    options: Object.keys(ReponseProgressive).map(label => ({label: label})),
    validators: [Validators.required],
    eligibilite: [
      {
        prestation: Prestation.AVANCES,
        isEligible: (value: any) => ReponseProgressive.NON !== value['domicileCantonGE']
      },
      {
        prestation: Prestation.ALLOCATION_LOGEMENT,
        isEligible: (value: any) => ReponseProgressive.NON !== value['domicileCantonGE']
      },
      // TODO On en fait rien de cette donée
      {prestation: Prestation.PC_AVS_AI},
      {
        prestation: Prestation.PC_FAM,
        isEligible: (value: any) => ReponseProgressive.NON !== value['domicileCantonGE']
      },
      {
        prestation: Prestation.AIDE_SOCIALE,
        isEligible: (value: any) => ReponseProgressive.NON !== value['domicileCantonGE']
      }
    ]
  }),
  new DateQuestion({
    key: 'dateArriveeGeneve',
    code: '0502',
    categorie: Categorie.SITUATION_PERSONELLE,
    subcategorie: Subcategorie.DOMICILE,
    help: true,
    maxDate: new Date(),
    minDate: moment().subtract(130, 'year').toDate(),
    shortcuts: [
      {label: 'DEPUIS_NAISSANCE'},
      {label: 'INCONNU'}
    ],
    validators: [Validators.required, DateQuestionValidators.atLeastOneSelected(true)],
    eligibilite: [
      {
        prestation: Prestation.PC_FAM,
        isEligible: (value: any) => habiteGeneveDepuis5ans(value)
      }
    ]
  }),
  new RadioQuestion({
    key: 'residenceEffectiveCantonGE',
    code: '0504',
    categorie: Categorie.SITUATION_PERSONELLE,
    subcategorie: Subcategorie.DOMICILE,
    help: true,
    inline: true,
    options: Object.keys(ReponseBinaire).map(label => ({label: label})),
    validators: [Validators.required],
    eligibilite: [
      {
        prestation: Prestation.AIDE_SOCIALE,
        isEligible: (value: any) => value['residenceEffectiveCantonGE'] !== ReponseBinaire.NON
      }
    ]
  }),
  new DateQuestion({
    key: 'dateArriveeSuisse',
    code: '0507',
    categorie: Categorie.SITUATION_PERSONELLE,
    subcategorie: Subcategorie.DOMICILE,
    help: true,
    maxDate: new Date(),
    minDate: moment().subtract(130, 'year').toDate(),
    shortcuts: [
      {label: 'DEPUIS_NAISSANCE'},
      {label: 'INCONNU'}
    ],
    skip: (value: any, prestationsEligibles: Prestation[]) =>
      isSuisse(value) ||
      isUEOrAELE(value) ||
      (prestationsEligibles === [Prestation.BOURSES] && isRefugie(value)),
    defaultAnswer: (value: any) =>
      habiteGeneveDepuisNaissance(value) ? {value: null, shortcut: 'DEPUIS_NAISSANCE'} : null,
    validators: [Validators.required, DateQuestionValidators.atLeastOneSelected(true)],
    eligibilite: [
      {
        prestation: Prestation.BOURSES,
        isEligible: (value: any) => habiteSuisseDepuis(value, 5) || isRefugie(value)
      },
      {
        prestation: Prestation.PC_AVS_AI,
        isEligible: (value: any) => habiteSuisseDepuis(value, 10) ||
                                    (habiteSuisseDepuis(value, 5) && isRefugieOrInconnu(value))
      }
    ]
  }),
  new DateQuestion({
    key: 'dateArriveeSuisseConjoint',
    code: '0509',
    categorie: Categorie.SITUATION_PERSONELLE,
    subcategorie: Subcategorie.DOMICILE,
    help: true,
    maxDate: new Date(),
    minDate: moment().subtract(130, 'year').toDate(),
    shortcuts: [{label: 'INCONNU'}],
    skip: (value: any) => isSuisse(value, 'nationaliteConjoint') ||
                          isUEOrAELE(value, 'nationaliteConjoint'),
    validators: [Validators.required, DateQuestionValidators.atLeastOneSelected(true)],
    eligibilite: [
      {
        prestation: Prestation.PC_AVS_AI_CONJOINT,
        isEligible: (value: any) => conjointHabiteSuisseDepuis(value, 10) ||
                                    (
                                      conjointHabiteSuisseDepuis(value, 5) &&
                                      isRefugieOrInconnu(value, 'refugieConjoint')
                                    )
      }
    ]
  })
];

const revenusOptions = [
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

const RevenusQuestions: QuestionBase<any>[] = [
  new CheckboxGroupQuestion({
    key: 'revenus',
    code: '0601',
    categorie: Categorie.SITUATION_PERSONELLE,
    subcategorie: Subcategorie.REVENUS,
    hasNone: true,
    validators: [
      Validators.required,
      CheckboxGroupValidators.atLeastOneSelected(Object.keys(TypeRevenus), true)
    ],
    options: revenusOptions,
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
    validators: [
      Validators.required,
      CheckboxGroupValidators.atLeastOneSelected(Object.keys(SituationRente), true)
    ],
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
    validators: [
      Validators.required,
      CheckboxGroupValidators.atLeastOneSelected(Object.keys(TypeRevenus), true)
    ],
    options: revenusOptions,
    skip: (value: any, prestationsEligibles: Prestation[]) =>
      !hasConjoint(value) ||
      (
        prestationsEligibles.includes(Prestation.PC_AVS_AI) &&
        (
          !prestationsEligibles.includes(Prestation.PC_FAM) ||
          !prestationsEligibles.includes(Prestation.AIDE_SOCIALE)
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
    validators: [
      Validators.required,
      CheckboxGroupValidators.atLeastOneSelected(Object.keys(SituationRente), true)
    ],
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
    validators: [
      Validators.required,
      CheckboxGroupValidators.atLeastOneSelected(Object.keys(TypeRevenus), true)
    ],
    options: revenusOptions,
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
    validators: [
      Validators.required,
      CheckboxGroupValidators.atLeastOneSelected(Object.keys(TypeRevenus), true)
    ],
    options: revenusOptions,
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
    validators: [
      Validators.required,
      CheckboxGroupValidators.atLeastOneSelected(Object.keys(SituationRente), true)
    ],
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
  })
];

const formationQuestions: QuestionBase<any>[] = [
  new RadioQuestion({
    key: 'enFormation',
    code: '0702',
    inline: true,
    categorie: Categorie.COMPLEMENTS,
    subcategorie: Subcategorie.FORMATION,
    validators: [Validators.required],
    options: Object.keys(ReponseBinaire).map(label => ({label: label})),
    eligibilite: [
      {
        prestation: Prestation.BOURSES,
        isEligible: (value: any) => value['enFormation'] === ReponseBinaire.OUI
      }
    ]
  }),
  new RadioQuestion({
    key: 'scolarite',
    code: '0701',
    categorie: Categorie.COMPLEMENTS,
    subcategorie: Subcategorie.FORMATION,
    validators: [Validators.required],
    options: [
      {label: Scolarite.SCOLARITE_OBLIGATOIRE_1P_A_10P},
      {label: Scolarite.SCOLARITE_OBLIGATOIRE_11P, help: true},
      {label: Scolarite.FORMATION_DOCTORALE, help: true},
      {label: Scolarite.FORMATION_CONTINUE, help: true},
      {label: Scolarite.AUCUNE},
      {label: Scolarite.INCONNU}
    ],
    eligibilite: [
      {
        prestation: Prestation.BOURSES,
        isEligible: (value: any) => aucuneScolarite(value)
      }
    ]
  })
];


const RentesQuestions: QuestionBase<any>[] = [];

const SituationProfessionnelleQuestions: QuestionBase<any>[] = [
  new RadioQuestion({
    key: 'taxationOffice',
    code: '0901',
    categorie: Categorie.COMPLEMENTS,
    subcategorie: Subcategorie.SITUATION_PROFESSIONNELLE,
    help: true,
    inline: true,
    options: Object.keys(ReponseProgressive).map(label => ({label: label})),
    validators: [Validators.required],
    altText: value => isConcubinageAutreParent(value) ? 'avecConcubin' : null,
    eligibilite: [
      {
        prestation: Prestation.PC_FAM,
        isEligible: (value: any) => value['taxationOffice'] !== ReponseProgressive.OUI
      }
    ]
  }),
  new TauxQuestion({
    key: 'tauxActivite',
    code: '0902',
    categorie: Categorie.COMPLEMENTS,
    subcategorie: Subcategorie.SITUATION_PROFESSIONNELLE,
    validators: [Validators.required],
    skip: (value: any) => !hasAnyRevenus(value, [TypeRevenus.EMPLOI]),
    eligibilite: [
      {
        prestation: Prestation.PC_FAM,
        isEligible: (value: any) => hasAnyRevenus(value, [TypeRevenus.CHOMAGE, TypeRevenus.APG]) ||
                                    hasConjoint(value) ||
                                    isConcubinageAutreParent(value) ||
                                    sumTauxActivite(value, false) > 40
      }
    ]
  }),
  new TauxQuestion({
    key: 'tauxActiviteDernierEmploi',
    code: '0903',
    categorie: Categorie.COMPLEMENTS,
    subcategorie: Subcategorie.SITUATION_PROFESSIONNELLE,
    validators: [Validators.required],
    skip: (value: any) => !hasAnyRevenus(value, [TypeRevenus.CHOMAGE, TypeRevenus.APG]),
    eligibilite: [
      {prestation: Prestation.PC_FAM}
    ]
  }),
  new RadioQuestion({
    key: 'tauxActiviteVariable6DernierMois',
    code: '0912',
    categorie: Categorie.COMPLEMENTS,
    subcategorie: Subcategorie.SITUATION_PROFESSIONNELLE,
    options: Object.keys(ReponseBinaire).map(label => ({label: label})),
    validators: [Validators.required],
    skip: (value: any) => !hasAnyRevenus(value, [TypeRevenus.CHOMAGE, TypeRevenus.APG]) ||
                          sumTauxActivite(value, false) > 40,
    eligibilite: [
      {
        prestation: Prestation.PC_FAM,
        isEligible: (value: any) => value['tauxActiviteVariable6DernierMois'] === ReponseBinaire.OUI ||
                                    hasConjoint(value) ||
                                    isConcubinageAutreParent(value)
      }
    ]
  }),

  new TauxQuestion({
    key: 'tauxActiviteMoyen6DernierMois',
    code: '0905',
    categorie: Categorie.COMPLEMENTS,
    subcategorie: Subcategorie.SITUATION_PROFESSIONNELLE,
    help: true,
    validators: [Validators.required],
    skip: (value: any) => value['tauxActiviteVariable6DernierMois'] !== ReponseBinaire.OUI,
    eligibilite: [
      {
        prestation: Prestation.PC_FAM,
        isEligible: (value: any) => sumTauxActivite(value, true) > 40 ||
                                    hasConjoint(value) ||
                                    isConcubinageAutreParent(value)
      }
    ]
  }),
  new TauxQuestion({
    key: 'tauxActiviteConjoint',
    code: '0907',
    categorie: Categorie.COMPLEMENTS,
    subcategorie: Subcategorie.SITUATION_PROFESSIONNELLE,
    validators: [Validators.required],
    altText: value => isConcubinageAutreParent(value) ? 'concubin' : null,
    skip: (value: any) => !hasAnyRevenus(value, [TypeRevenus.EMPLOI], 'revenusConjoint') &&
                          !hasAnyRevenus(value, [TypeRevenus.EMPLOI], 'revenusConcubin'),
    eligibilite: [
      {
        prestation: Prestation.PC_FAM,
        isEligible: (value: any) =>
          hasAnyRevenus(value, [TypeRevenus.CHOMAGE, TypeRevenus.APG], 'revenusConjoint') ||
          hasAnyRevenus(value, [TypeRevenus.CHOMAGE, TypeRevenus.APG], 'revenusConcubin') ||
          sumTauxActiviteAvecConjoint(value, false) > 90
      }
    ]
  }),
  new TauxQuestion({
    key: 'tauxActiviteDernierEmploiConjoint',
    code: '0908',
    categorie: Categorie.COMPLEMENTS,
    subcategorie: Subcategorie.SITUATION_PROFESSIONNELLE,
    validators: [Validators.required],
    altText: value => isConcubinageAutreParent(value) ? 'concubin' : null,
    skip: (value: any) =>
      !hasAnyRevenus(value, [TypeRevenus.CHOMAGE, TypeRevenus.APG], 'revenusConjoint') &&
      !hasAnyRevenus(value, [TypeRevenus.CHOMAGE, TypeRevenus.APG], 'revenusConcubin'),
    eligibilite: [
      {prestation: Prestation.PC_FAM}
    ]
  }),
  new RadioQuestion({
    key: 'tauxActiviteVariable6DernierMoisConjoint',
    code: '0913',
    categorie: Categorie.COMPLEMENTS,
    subcategorie: Subcategorie.SITUATION_PROFESSIONNELLE,
    options: Object.keys(ReponseBinaire).map(label => ({label: label})),
    validators: [Validators.required],
    altText: value => isConcubinageAutreParent(value) ? 'concubin' : null,
    skip: (value: any) =>
      (!hasAnyRevenus(value, [TypeRevenus.CHOMAGE, TypeRevenus.APG], 'revenusConjoint') &&
       !hasAnyRevenus(value, [TypeRevenus.CHOMAGE, TypeRevenus.APG], 'revenusConcubin')) ||
      sumTauxActiviteAvecConjoint(value, false) > 90,
    eligibilite: [
      {
        prestation: Prestation.PC_FAM,
        isEligible: (value: any) => value['tauxActiviteVariable6DernierMoisConjoint'] === ReponseBinaire.OUI
      }
    ]
  }),

  new TauxQuestion({
    key: 'tauxActiviteMoyen6DernierMoisConjoint',
    code: '0910',
    categorie: Categorie.COMPLEMENTS,
    subcategorie: Subcategorie.SITUATION_PROFESSIONNELLE,
    help: true,
    validators: [Validators.required],
    altText: value => isConcubinageAutreParent(value) ? 'concubin' : null,
    skip: (value: any) => value['tauxActiviteVariable6DernierMoisConjoint'] !== ReponseBinaire.OUI,
    eligibilite: [
      {
        prestation: Prestation.PC_FAM,
        isEligible: (value: any) => sumTauxActiviteAvecConjoint(value, true) > 90
      }
    ]
  })
];

const LogementQuestions: QuestionBase<any>[] = [
  new RadioQuestion({
    key: 'proprietaireOuLocataireLogement',
    code: '1001',
    categorie: Categorie.COMPLEMENTS,
    subcategorie: Subcategorie.LOGEMENT,
    help: true,
    inline: true,
    options: Object.keys(Logement).map(label => ({label: label})),
    validators: [Validators.required],
    eligibilite: [
      {
        prestation: Prestation.ALLOCATION_LOGEMENT,
        isEligible: (value: any) => value['proprietaireOuLocataireLogement'] !== Logement.PROPRIETAIRE
      }
    ]
  }),
  new RadioQuestion({
    key: 'bailLogementAVotreNom',
    code: '1002',
    categorie: Categorie.COMPLEMENTS,
    subcategorie: Subcategorie.LOGEMENT,
    help: true,
    inline: true,
    options: Object.keys(ReponseProgressive).map(label => ({label: label})),
    validators: [Validators.required],
    eligibilite: [
      {
        prestation: Prestation.ALLOCATION_LOGEMENT,
        isEligible: (value: any) => value['bailLogementAVotreNom'] !== ReponseProgressive.NON
      }
    ]
  }),
  new NumberQuestion({
    key: 'nombreDePersonnesLogement',
    code: '1003',
    categorie: Categorie.COMPLEMENTS,
    subcategorie: Subcategorie.LOGEMENT,
    help: true,
    min: 1,
    max: 20,
    validators: [Validators.required],
    eligibilite: [
      {prestation: Prestation.ALLOCATION_LOGEMENT}
    ]
  }),
  new NumberQuestion({
    key: 'nombreDePiecesLogement',
    code: '1004',
    categorie: Categorie.COMPLEMENTS,
    subcategorie: Subcategorie.LOGEMENT,
    help: true,
    min: 1,
    max: 20,
    validators: [Validators.required],
    eligibilite: [
      {
        prestation: Prestation.ALLOCATION_LOGEMENT,
        isEligible: (value: any) => isRatioPiecesPersonnesLogementAcceptable(value)
      }
    ]
  }),
  new RadioQuestion({
    key: 'appartementHabitationMixte',
    code: '1005',
    categorie: Categorie.COMPLEMENTS,
    subcategorie: Subcategorie.LOGEMENT,
    help: true,
    inline: true,
    options: Object.keys(ReponseProgressive).map(label => ({label: label})),
    validators: [Validators.required],
    eligibilite: [
      {
        prestation: Prestation.ALLOCATION_LOGEMENT,
        isEligible: (value: any) => value['appartementHabitationMixte'] !== ReponseProgressive.OUI
      }
    ]
  }),
  new RadioQuestion({
    key: 'montantLoyerFixeOuVariable',
    code: '1006',
    categorie: Categorie.COMPLEMENTS,
    subcategorie: Subcategorie.LOGEMENT,
    help: true,
    options: Object.keys(Loyer).map(label => ({label: label})),
    validators: [Validators.required],
    eligibilite: [
      {
        prestation: Prestation.ALLOCATION_LOGEMENT,
        isEligible: (value: any) => value['montantLoyerFixeOuVariable'] !== Loyer.EN_FONCTION_REVENU
      }
    ]
  })
];

const AssuranceMaladieQuestions: QuestionBase<any>[] = [
  new RadioQuestion({
    key: 'assuranceMaladieSuisse',
    code: '1101',
    categorie: Categorie.COMPLEMENTS,
    subcategorie: Subcategorie.ASSURANCE_MALADIE,
    help: true,
    inline: true,
    options: Object.keys(ReponseProgressive).map(label => ({label: label})),
    validators: [Validators.required],
    eligibilite: [
      {
        prestation: Prestation.SUBSIDES,
        isEligible: (value: any) => value['assuranceMaladieSuisse'] !== ReponseProgressive.NON
      }
    ]
  })
];

const PensionAlimentaireQuestions: QuestionBase<any>[] = [
  new RadioQuestion({
    key: 'droitPensionAlimentaire',
    code: '1201',
    categorie: Categorie.COMPLEMENTS,
    subcategorie: Subcategorie.PENSION_ALIMENTAIRE,
    help: true,
    inline: true,
    options: Object.keys(ReponseBinaire).map(label => ({label: label})),
    validators: [Validators.required],
    eligibilite: [
      {
        prestation: Prestation.AVANCES,
        isEligible: (value: any) => value['droitPensionAlimentaire'] === ReponseBinaire.OUI
      }
    ]
  }),
  new RadioQuestion({
    key: 'recoisEntierementPensionAlimentaire',
    code: '1202',
    categorie: Categorie.COMPLEMENTS,
    subcategorie: Subcategorie.PENSION_ALIMENTAIRE,
    help: true,
    inline: true,
    options: Object.keys(ReponseBinaire).map(label => ({label: label})),
    validators: [Validators.required],
    eligibilite: [
      {
        prestation: Prestation.AVANCES,
        isEligible: (value: any) => value['recoisEntierementPensionAlimentaire'] === ReponseBinaire.NON
      }
    ]
  })
];

const MontantFortuneQuestions: QuestionBase<any>[] = [
  new RadioQuestion({
    key: 'fortuneSuperieureA',
    code: '1302',
    categorie: Categorie.COMPLEMENTS,
    subcategorie: Subcategorie.MONTANT_FORTUNE,
    help: true,
    inline: true,
    labelParameters: {
      limite: (value: any) => getLimiteFortune(value)
    },
    options: Object.keys(ReponseBinaire).map(label => ({label: label})),
    validators: [Validators.required],
    eligibilite: [
      {
        prestation: Prestation.AIDE_SOCIALE,
        isEligible: (value: any) => !hasFortuneTropEleve(value)
      }
    ]
  }),
  new RadioQuestion({
    key: 'impotFortune',
    code: '1301',
    categorie: Categorie.COMPLEMENTS,
    subcategorie: Subcategorie.MONTANT_FORTUNE,
    help: true,
    inline: true,
    options: Object.keys(ReponseProgressive).map(label => ({label: label})),
    validators: [Validators.required],
    skip: (value: any) => value['fortuneSuperieureA'] !== null && !hasFortuneTropEleve(value),
    eligibilite: [
      {
        prestation: Prestation.ALLOCATION_LOGEMENT,
        isEligible: (value: any) => value['impotFortune'] !== ReponseProgressive.OUI
      }
    ]
  })
];

const SituationFiscaleQuestions: QuestionBase<any>[] = [
  new RadioQuestion({
    key: 'exempteImpot',
    code: '1401',
    categorie: Categorie.COMPLEMENTS,
    subcategorie: Subcategorie.SITUATION_FISCALE,
    help: true,
    inline: true,
    options: Object.keys(ReponseProgressive).map(label => ({label: label})),
    validators: [Validators.required],
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
      annee: moment().subtract(2, 'year').get('year')
    },
    options: Object.keys(ReponseProgressive).map(label => ({label: label})),
    validators: [Validators.required],
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
    validators: [Validators.required],
    skip: (value: any) => isRefugie(value),
    altText: value => hasConjoint(value) ? 'avecConjoint' : null,
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
    validators: [Validators.required],
    skip: (value: any) => !hasPermisBEtudes(value),
    eligibilite: [
      {
        prestation: Prestation.BOURSES,
        isEligible: (value: any) => value['parentsHabiteFranceTravailleSuisse'] !== ReponseProgressive.NON
      }
    ]
  })
];

export const AllQuestions: QuestionBase<any>[] = [].concat(
  PrestationQuestions,
  AgeQuestions,
  EtatCivilQuestions,
  NationaliteQuestions,
  DomicileQuestions,
  RevenusQuestions,
  formationQuestions,
  RentesQuestions,
  SituationProfessionnelleQuestions,
  LogementQuestions,
  AssuranceMaladieQuestions,
  PensionAlimentaireQuestions,
  MontantFortuneQuestions,
  SituationFiscaleQuestions
);
