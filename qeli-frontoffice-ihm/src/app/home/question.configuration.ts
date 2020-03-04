import {
  CheckboxGroupQuestion, CheckboxGroupValidators
} from '../core/question/checkbox-group-question/checkbox-group-question.model';
import { Prestation } from '../core/common/prestation.model';
import { QuestionBase } from '../core/question/question-base.model';
import { Validators } from '@angular/forms';
import {
  aucuneScolarite, getLimiteFortune, habiteGeneveDepuis5ans, hasAnyAVSOrAIRevenus, hasAnyEnfantOfType,
  hasAnyPrestations, hasAnyRevenus, hasConjoint, hasEnfants, hasFortuneTropEleve, hasPermisBEtudes, hasPrestation,
  isApatride, isConcubinageAutreParent, isConjointApatride, isConjointSuisse, isConjointUEOrAELE,
  isFonctionnaireInternational, isMineur, isRatioPiecesPersonnesLogementAcceptable, isRefugieOrRequerantAsile, isSuisse,
  isUEOrAELE
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
import { TextQuestion } from '../core/question/text-question/text-question.model';
import { Loyer } from './model/loyer.model';
import { Categorie, Subcategorie } from '../core/question/question-categorie.model';
import {
  NumberField, NumberGroupQuestion, NumberGroupQuestionValidators
} from '../core/question/number-group-question/number-group-question.model';
import { TypeEnfant } from './model/type-enfant.model';
import { QuestionOption } from '../core/question/option.model';

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
      CheckboxGroupValidators.atLeastOneSelected(Object.keys(Prestation), true)
    ],
    options: Object.keys(Prestation).map(prestation => ({label: prestation})),
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
      {prestation: Prestation.PC_AVS_AI},
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
        isEligible: (value: any) => !hasEnfants(value) || hasAnyEnfantOfType(value, [
          TypeEnfant.MOINS_18,
          TypeEnfant.ENTRE_18_25_EN_FORMATION
        ])
      },
      {prestation: Prestation.PC_AVS_AI},
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
      {prestation: Prestation.PC_AVS_AI},
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
                          isConjointSuisse(value) ||
                          isConjointUEOrAELE(value) ||
                          isConjointApatride(value),
    eligibilite: [
      {prestation: Prestation.PC_AVS_AI},
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
                          isRefugieOrRequerantAsile(value) ||
                          isApatride(value),
    eligibilite: [
      {prestation: Prestation.BOURSES}
    ]
  }),
  new RadioQuestion({
    key: 'permisBPlus5Ans',
    code: '0406',
    categorie: Categorie.SITUATION_PERSONELLE,
    subcategorie: Subcategorie.NATIONALITE,
    help: true,
    inline: true,
    options: Object.keys(ReponseProgressive).map(label => ({label: label})),
    validators: [Validators.required],
    skip: (value: any) => isSuisse(value) ||
                          isRefugieOrRequerantAsile(value) ||
                          isApatride(value),
    eligibilite: [
      {
        prestation: Prestation.BOURSES,
        isEligible: (value: any) => ReponseProgressive.NON !== value['permisBPlus5Ans']
      }
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
      {
        prestation: Prestation.PC_AVS_AI,
        isEligible: (value: any) => ReponseProgressive.NON !== value['domicileCantonGE']
      },
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
      {prestation: Prestation.PC_AVS_AI},
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
    skip: (value: any) => !hasConjoint(value),
    eligibilite: [
      {prestation: Prestation.PC_AVS_AI},
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
    code: '0606',
    categorie: Categorie.SITUATION_PERSONELLE,
    subcategorie: Subcategorie.REVENUS,
    hasNone: true,
    validators: [
      Validators.required,
      CheckboxGroupValidators.atLeastOneSelected(Object.keys(TypeRevenus), true)
    ],
    options: revenusOptions,
    skip: (value: any) => !hasAnyEnfantOfType(value, [
      TypeEnfant.MOINS_18,
      TypeEnfant.ENTRE_18_25_EN_FORMATION
    ]),
    eligibilite: [
      {prestation: Prestation.PC_AVS_AI}
    ]
  })
];

const formationQuestions: QuestionBase<any>[] = [
  new RadioQuestion({
    key: 'enFormation',
    code: '0702',
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
    help: true,
    hasNone: true,
    validators: [Validators.required],
    options: Object.values(Scolarite)
                   .filter(scolarite => scolarite !== Scolarite.AUCUNE)
                   .map(scolarite => ({label: Scolarite[scolarite], help: true} as QuestionOption))
                   .concat({label: Scolarite.AUCUNE} as QuestionOption),
    eligibilite: [
      {
        prestation: Prestation.BOURSES,
        isEligible: (value: any) => aucuneScolarite(value)
      }
    ]
  })
];


const RentesQuestions: QuestionBase<any>[] = [];

const SituationProfesionelleQuestions: QuestionBase<any>[] = [];

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
  new TextQuestion({
    key: 'nombreDePersonnesLogement',
    code: '1003',
    categorie: Categorie.COMPLEMENTS,
    subcategorie: Subcategorie.LOGEMENT,
    help: true,
    type: 'number',
    validators: [Validators.required,
                 Validators.pattern('[0-9]'),
                 Validators.min(1),
                 Validators.max(20)],
    eligibilite: [
      {prestation: Prestation.ALLOCATION_LOGEMENT}
    ]
  }),
  new TextQuestion({
    key: 'nombreDePiecesLogement',
    code: '1004',
    categorie: Categorie.COMPLEMENTS,
    subcategorie: Subcategorie.LOGEMENT,
    help: true,
    type: 'number',
    validators: [Validators.required,
                 Validators.pattern('[0-9]'),
                 Validators.min(1),
                 Validators.max(20)],
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
  SituationProfesionelleQuestions,
  LogementQuestions,
  AssuranceMaladieQuestions,
  PensionAlimentaireQuestions,
  MontantFortuneQuestions,
  SituationFiscaleQuestions
);
