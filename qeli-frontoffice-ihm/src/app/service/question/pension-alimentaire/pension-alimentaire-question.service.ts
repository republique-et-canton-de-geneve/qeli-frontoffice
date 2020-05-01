import { Injectable } from '@angular/core';
import { QuestionLoader} from '../question-loader';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { Categorie, QeliQuestionDecorator, Subcategorie } from '../qeli-question-decorator.model';
import { Eligibilite, EligibiliteGroup } from '../eligibilite.model';
import { RadioQuestion } from '../../../dynamic-question/radio-question/radio-question.model';
import { Prestation } from '../../configuration/prestation.model';
import { REPONSE_BINAIRE_OPTIONS, ReponseBinaire } from '../reponse-binaire.model';
import { QuestionUtils } from '../qeli-questions.utils';

@Injectable({
  providedIn: 'root'
})
export class PensionAlimentaireQuestionService implements QuestionLoader {

  loadQuestions(configuration: QeliConfiguration, eligibilites: Eligibilite[]): QeliQuestionDecorator<any>[] {
    const eligibiliteGroup = new EligibiliteGroup(eligibilites);
    return [{
      question: new RadioQuestion({
        key: 'droitPensionAlimentaire',
        dataCyIdentifier: '1201_droitPensionAlimentaire',
        label: {key: 'question.droitPensionAlimentaire.label'},
        help: {key: 'question.droitPensionAlimentaire.help'},
        errorLabels: {required: {key: 'question.droitPensionAlimentaire.error.required'}},
        inline: true,
        radioOptions: REPONSE_BINAIRE_OPTIONS
      }),
      calculateRefus: QuestionUtils.rejectPrestationByOptionAnswerFn(
        'droitPensionAlimentaire',
        ReponseBinaire.NON,
        Prestation.AVANCES,
        (eligibilite) => ({key: `question.droitPensionAlimentaire.motifRefus.${eligibilite.prestation}`})
      ),
      eligibilites: eligibiliteGroup.findByPrestation(Prestation.AVANCES),
      categorie: Categorie.COMPLEMENTS,
      subcategorie: Subcategorie.PENSION_ALIMENTAIRE
    }, {
      question: new RadioQuestion({
        key: 'recoisEntierementPensionAlimentaire',
        dataCyIdentifier: '1202_recoisEntierementPensionAlimentaire',
        label: {key: 'question.recoisEntierementPensionAlimentaire.label'},
        help: {key: 'question.recoisEntierementPensionAlimentaire.help'},
        errorLabels: {required: {key: 'question.recoisEntierementPensionAlimentaire.error.required'}},
        inline: true,
        radioOptions: REPONSE_BINAIRE_OPTIONS
      }),
      calculateRefus: QuestionUtils.rejectPrestationByOptionAnswerFn(
        'recoisEntierementPensionAlimentaire',
        ReponseBinaire.OUI,
        Prestation.AVANCES,
        (eligibilite) => ({key: `question.recoisEntierementPensionAlimentaire.motifRefus.${eligibilite.prestation}`})
      ),
      eligibilites: eligibiliteGroup.findByPrestation(Prestation.AVANCES),
      categorie: Categorie.COMPLEMENTS,
      subcategorie: Subcategorie.PENSION_ALIMENTAIRE
    }
    ];
  }
}
