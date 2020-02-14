import {
  CheckboxGroupQuestion, CheckboxGroupValidators
} from '../core/question/checkbox-group-question/checkbox-group-question.model';
import { Prestation } from '../core/common/prestation.model';
import { QuestionOption } from '../core/question/option.model';
import { Eligibilite, QuestionBase } from '../core/question/question-base.model';
import { Validators } from '@angular/forms';
import {
  aucuneScolarite, getLimiteFortune, hasActivites, hasConjoint, hasPermisBEtudes, hasPrestations, isApatride,
  isFonctionnaireInternational, isMineur, isRatioPiecesPersonnesLogementAcceptable, isRefugie, isSuisse, isUEOrAELE,
  notHasFortuneTropEleve
} from './qeli-questions.utils';
import { DateQuestion } from '../core/question/date-question/date-question.model';
import * as moment from 'moment';
import { DropdownQuestion } from '../core/question/dropdown-question/dropdown-question.model';
import { EtatCivil } from './model/etat-civil.model';
import { NationaliteQuestion } from '../core/question/nationalite-question/nationalite-question.model';
import { RadioQuestion } from '../core/question/radio-question/radio-question.model';
import { RequerantRefugie } from './model/requerant-refugie.model';
import { ReponseBinaire, ReponseProgressive } from './model/reponse.model';
import { Activite } from './model/activite.model';
import { Scolarite } from './model/scolarite.model';
import { Logement } from './model/logement.model';
import { TextQuestion } from '../core/question/text-question/text-question.model';
import { Loyer } from './model/loyer.model';
import { Categorie, Subcategorie } from '../core/question/question-categorie.model';

const PrestationQuestions: QuestionBase<any>[] = [
  new CheckboxGroupQuestion({
    key: 'prestations',
    code: '0101',
    categorie: Categorie.SITUATION_PERSONELLE,
    subcategorie: Subcategorie.PRESTATION,
    help: true,
    options: Object.keys(Prestation).map(prestation => new QuestionOption({label: prestation})),
    eligibilite: Object.values(Prestation).map(
      prestation => new Eligibilite(
        prestation, (value: any) => !hasPrestations(value, [prestation])
      )
    )
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
    validators: [Validators.required],
    eligibilite: [
      new Eligibilite(Prestation.AIDE_SOCIALE, (value: any) => !isMineur(value))
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
      new Eligibilite(Prestation.PC_AVS_AI, () => true),
      new Eligibilite(Prestation.BOURSES, () => true),
      new Eligibilite(Prestation.PC_FAM, () => true),
      new Eligibilite(Prestation.AIDE_SOCIALE, () => true)
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
      new Eligibilite(Prestation.PC_AVS_AI, () => true),
      new Eligibilite(Prestation.BOURSES, () => true)
    ]
  }),
  new RadioQuestion({
    key: 'refugie',
    code: '0402',
    categorie: Categorie.SITUATION_PERSONELLE,
    subcategorie: Subcategorie.NATIONALITE,
    help: true,
    options: Object.keys(RequerantRefugie).map(label => new QuestionOption({label: label})),
    validators: [Validators.required],
    defaultAnswer: (value: any) => (isSuisse(value) ||
                                    isUEOrAELE(value) ||
                                    isApatride(value)) ? RequerantRefugie.AUCUN : null,
    eligibilite: [
      new Eligibilite(Prestation.PC_AVS_AI, () => true),
      new Eligibilite(Prestation.BOURSES, () => true)
    ]
  }),
  new RadioQuestion({
    key: 'permisBEtudes',
    code: '0405',
    categorie: Categorie.SITUATION_PERSONELLE,
    subcategorie: Subcategorie.NATIONALITE,
    help: true,
    inline: true,
    options: Object.keys(ReponseProgressive).map(label => new QuestionOption({label: label})),
    validators: [Validators.required],
    defaultAnswer: (value: any) => (isSuisse(value) ||
                                    isRefugie(value) ||
                                    isApatride(value)) ? ReponseProgressive.INCONNU : null,
    eligibilite: [
      new Eligibilite(Prestation.BOURSES, () => true)
    ]
  }),
  new RadioQuestion({
    key: 'permisBPlus5Ans',
    code: '0406',
    categorie: Categorie.SITUATION_PERSONELLE,
    subcategorie: Subcategorie.NATIONALITE,
    help: true,
    inline: true,
    options: Object.keys(ReponseProgressive).map(label => new QuestionOption({label: label})),
    validators: [Validators.required],
    defaultAnswer: (value: any) => (isSuisse(value) ||
                                    isRefugie(value) ||
                                    isApatride(value)) ? ReponseProgressive.INCONNU : null,
    eligibilite: [
      new Eligibilite(
        Prestation.BOURSES, (value: any) => ReponseProgressive.NON !== value['permisBPlus5Ans']
      )
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
    options: Object.keys(ReponseProgressive).map(label => new QuestionOption({label: label})),
    validators: [Validators.required],
    eligibilite: [
      new Eligibilite(
        Prestation.AVANCES, (value: any) => ReponseProgressive.NON !== value['domicileCantonGE']
      ),
      new Eligibilite(
        Prestation.ALLOCATION_LOGEMENT,
        (value: any) => ReponseProgressive.NON !== value['domicileCantonGE']
      ),
      new Eligibilite(
        Prestation.PC_AVS_AI, (value: any) => ReponseProgressive.NON !== value['domicileCantonGE']
      ),
      new Eligibilite(
        Prestation.PC_FAM, (value: any) => ReponseProgressive.NON !== value['domicileCantonGE']
      ),
      new Eligibilite(
        Prestation.AIDE_SOCIALE, (value: any) => ReponseProgressive.NON !== value['domicileCantonGE']
      )
    ]
  }),
  new RadioQuestion({
    key: 'residenceEffectiveCantonGE',
    code: '0504',
    categorie: Categorie.SITUATION_PERSONELLE,
    subcategorie: Subcategorie.DOMICILE,
    help: true,
    inline: true,
    options: Object.keys(ReponseBinaire).map(label => new QuestionOption({label: label})),
    validators: [Validators.required],
    eligibilite: [
      new Eligibilite(
        Prestation.AIDE_SOCIALE, (value: any) => value['residenceEffectiveCantonGE'] !== ReponseBinaire.NON
      )
    ]
  }),
  new TextQuestion({
    key: 'enfantsACharge',
    code: '0505',
    categorie: Categorie.SITUATION_PERSONELLE,
    subcategorie: Subcategorie.DOMICILE,
    help: true,
    type: 'number',
    validators: [Validators.required,
                 Validators.pattern('\-?[0-9]*'),
                 Validators.min(0),
                 Validators.max(20)],
    eligibilite: [
      new Eligibilite(Prestation.PC_FAM, (value: any) => value['enfantsACharge'] > 0),
      new Eligibilite(Prestation.AIDE_SOCIALE, () => true)
    ]
  })
];

const ActiviteQuestions: QuestionBase<any>[] = [
  new CheckboxGroupQuestion({
    key: 'activite',
    code: '0601',
    categorie: Categorie.SITUATION_PERSONELLE,
    subcategorie: Subcategorie.ACTIVITE,
    help: true,
    hasNone: true,
    validators: [
      Validators.required,
      CheckboxGroupValidators.atLeastOneSelected(Object.keys(Activite), true),
      CheckboxGroupValidators.noneDetailRequired
    ],
    options: Object.keys(Activite).map(label => new QuestionOption({label: label})),
    eligibilite: [
      new Eligibilite(Prestation.BOURSES,
        (value: any) => hasActivites(value, [Activite.ETUDIANT])),
      new Eligibilite(Prestation.PC_FAM, () => true),
      new Eligibilite(Prestation.AIDE_SOCIALE, () => true)
    ]
  })
];

const formationQuestions: QuestionBase<any>[] = [
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
                   .map(scolarite => new QuestionOption({label: Scolarite[scolarite], help: true}))
                   .concat(new QuestionOption({label: Scolarite.AUCUNE})),
    eligibilite: [
      new Eligibilite(Prestation.BOURSES, (value: any) => aucuneScolarite(value))
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
    options: Object.keys(Logement).map(label => new QuestionOption({label: label})),
    validators: [Validators.required],
    eligibilite: [
      new Eligibilite(
        Prestation.ALLOCATION_LOGEMENT,
        (value: any) => value['proprietaireOuLocataireLogement'] !== Logement.PROPRIETAIRE
      )
    ]
  }),
  new RadioQuestion({
    key: 'bailLogementAVotreNom',
    code: '1002',
    categorie: Categorie.COMPLEMENTS,
    subcategorie: Subcategorie.LOGEMENT,
    help: true,
    inline: true,
    options: Object.keys(ReponseProgressive).map(label => new QuestionOption({label: label})),
    validators: [Validators.required],
    eligibilite: [
      new Eligibilite(
        Prestation.ALLOCATION_LOGEMENT,
        (value: any) => value['bailLogementAVotreNom'] !== ReponseProgressive.NON
      )
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
      new Eligibilite(Prestation.ALLOCATION_LOGEMENT, (value: any) => true)
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
      new Eligibilite(Prestation.ALLOCATION_LOGEMENT,
        (value: any) => isRatioPiecesPersonnesLogementAcceptable(value)
      )
    ]
  }),
  new RadioQuestion({
    key: 'appartementHabitationMixte',
    code: '1005',
    categorie: Categorie.COMPLEMENTS,
    subcategorie: Subcategorie.LOGEMENT,
    help: true,
    inline: true,
    options: Object.keys(ReponseProgressive).map(label => new QuestionOption({label: label})),
    validators: [Validators.required],
    eligibilite: [
      new Eligibilite(
        Prestation.ALLOCATION_LOGEMENT,
        (value: any) => value['appartementHabitationMixte'] !== ReponseProgressive.OUI
      )
    ]
  }),
  new RadioQuestion({
    key: 'montantLoyerFixeOuVariable',
    code: '1006',
    categorie: Categorie.COMPLEMENTS,
    subcategorie: Subcategorie.LOGEMENT,
    help: true,
    options: Object.keys(Loyer).map(label => new QuestionOption({label: label})),
    validators: [Validators.required],
    eligibilite: [
      new Eligibilite(
        Prestation.ALLOCATION_LOGEMENT,
        (value: any) => value['montantLoyerFixeOuVariable'] !== Loyer.EN_FONCTION_REVENU
      )
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
    options: Object.keys(ReponseProgressive).map(label => new QuestionOption({label: label})),
    validators: [Validators.required],
    eligibilite: [
      new Eligibilite(
        Prestation.SUBSIDES,
        (value: any) => value['assuranceMaladieSuisse'] !== ReponseProgressive.NON
      )
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
    options: Object.keys(ReponseBinaire).map(label => new QuestionOption({label: label})),
    validators: [Validators.required],
    eligibilite: [
      new Eligibilite(
        Prestation.AVANCES, (value: any) => value['droitPensionAlimentaire'] === ReponseBinaire.OUI
      )
    ]
  }),
  new RadioQuestion({
    key: 'recoisEntierementPensionAlimentaire',
    code: '1202',
    categorie: Categorie.COMPLEMENTS,
    subcategorie: Subcategorie.PENSION_ALIMENTAIRE,
    help: true,
    inline: true,
    options: Object.keys(ReponseBinaire).map(label => new QuestionOption({label: label})),
    validators: [Validators.required],
    eligibilite: [
      new Eligibilite(
        Prestation.AVANCES,
        (value: any) => value['recoisEntierementPensionAlimentaire'] === ReponseBinaire.NON
      )
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
    options: Object.keys(ReponseBinaire).map(label => new QuestionOption({label: label})),
    validators: [Validators.required],
    eligibilite: [
      new Eligibilite(
        Prestation.AIDE_SOCIALE, (value: any) => value['fortuneSuperieureA'] !== ReponseBinaire.OUI
      )
    ]
  }),
  new RadioQuestion({
    key: 'impotFortune',
    code: '1301',
    categorie: Categorie.COMPLEMENTS,
    subcategorie: Subcategorie.MONTANT_FORTUNE,
    help: true,
    inline: true,
    options: Object.keys(ReponseProgressive).map(label => new QuestionOption({label: label})),
    validators: [Validators.required],
    defaultAnswer: (value: any) => (notHasFortuneTropEleve(value)) ? ReponseProgressive.NON : null,
    eligibilite: [
      new Eligibilite(
        Prestation.ALLOCATION_LOGEMENT, (value: any) => value['impotFortune'] !== ReponseProgressive.OUI
      )
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
    options: Object.keys(ReponseProgressive).map(label => new QuestionOption({label: label})),
    validators: [Validators.required],
    eligibilite: [
      new Eligibilite(
        Prestation.SUBSIDES, (value: any) => value['exempteImpot'] !== ReponseProgressive.OUI
      )
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
    options: Object.keys(ReponseProgressive).map(label => new QuestionOption({label: label})),
    validators: [Validators.required],
    eligibilite: [
      new Eligibilite(
        Prestation.SUBSIDES, (value: any) => value['taxeOfficeAFC'] !== ReponseProgressive.OUI
      )
    ]
  }),
  new RadioQuestion({
    key: 'fonctionnaireInternational',
    code: '1403',
    categorie: Categorie.COMPLEMENTS,
    subcategorie: Subcategorie.SITUATION_FISCALE,
    help: true,
    inline: true,
    options: Object.keys(ReponseProgressive).map(label => new QuestionOption({label: label})),
    validators: [Validators.required],
    altText: value => hasConjoint(value) ? 'avecConjoint' : null,
    eligibilite: [
      new Eligibilite(Prestation.BOURSES, (value: any) => !isFonctionnaireInternational(value))
    ]
  }),
  new RadioQuestion({
    key: 'parentsHabiteFranceTravailleSuisse',
    code: '1404',
    categorie: Categorie.COMPLEMENTS,
    subcategorie: Subcategorie.SITUATION_FISCALE,
    help: true,
    inline: true,
    options: Object.keys(ReponseProgressive).map(label => new QuestionOption({label: label})),
    validators: [Validators.required],
    defaultAnswer: (value: any) => !hasPermisBEtudes(value) ? ReponseProgressive.INCONNU : null,
    eligibilite: [
      new Eligibilite(
        Prestation.BOURSES,
        (value: any) => value['parentsHabiteFranceTravailleSuisse'] !== ReponseProgressive.NON
      )
    ]
  })
];

export const AllQuestions: QuestionBase<any>[] = [].concat(
  PrestationQuestions,
  AgeQuestions,
  EtatCivilQuestions,
  NationaliteQuestions,
  DomicileQuestions,
  ActiviteQuestions,
  formationQuestions,
  RentesQuestions,
  SituationProfesionelleQuestions,
  LogementQuestions,
  AssuranceMaladieQuestions,
  PensionAlimentaireQuestions,
  MontantFortuneQuestions,
  SituationFiscaleQuestions
);
