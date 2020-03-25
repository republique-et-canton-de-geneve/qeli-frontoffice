import { Injectable } from '@angular/core';
import { QuestionLoader } from '../question-loader';
import { QuestionBase } from '../../../dynamic-form/dynamic-question/question/question-base.model';
import { Categorie, Subcategorie } from '../../../dynamic-form/dynamic-question/question/question-categorie.model';
import { Prestation } from '../../../dynamic-form/model/prestation.model';
import { aucuneScolarite } from '../qeli-questions.utils';
import { Demandeur, QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { RadioQuestion } from '../../../dynamic-form/dynamic-question/question/radio-question/radio-question.model';
import { ReponseBinaire } from '../../../dynamic-form/model/reponse.model';
import { Scolarite } from './scolarite.model';

@Injectable({
  providedIn: 'root'
})
export class FormationQuestionService implements QuestionLoader {

  loadQuestions(configuration: QeliConfiguration, demandeur: Demandeur): QuestionBase<any>[] {
    return [
      new RadioQuestion({
        key: 'enFormation',
        code: '0702',
        inline: true,
        categorie: Categorie.COMPLEMENTS,
        subcategorie: Subcategorie.FORMATION,
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
  }
}
