import { QuestionLoader } from '../question-loader';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { Categorie, QeliQuestionDecorator } from '../qeli-question-decorator.model';
import { EligibiliteGroup } from '../eligibilite.model';
import { RadioQuestion } from '../../../dynamic-question/radio-question/radio-question.model';
import { Prestation } from '../../configuration/prestation.model';
import { REPONSE_BINAIRE_OPTIONS, ReponseBinaire } from '../reponse-binaire.model';
import { QuestionUtils } from '../qeli-questions.utils';

export class PensionAlimentaireQuestionService extends QuestionLoader {

  loadQuestions(configuration: QeliConfiguration): QeliQuestionDecorator<any>[] {
    const eligibiliteGroup = new EligibiliteGroup(this.demandeur.toEligibilite(), this.demandeur);
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
        this.demandeur,
        (eligibilite) => ({key: `question.droitPensionAlimentaire.motifRefus.${eligibilite.prestation}`})
      ),
      eligibilites: eligibiliteGroup.findByPrestation(Prestation.AVANCES),
      categorie: Categorie.PENSION_ALIMENTAIRE
    }, {
      question: new RadioQuestion({
        key: 'recoisEntierementPensionAlimentaire',
        dataCyIdentifier: '1202_recoisEntierementPensionAlimentaire',
        label: {key: 'question.recoisEntierementPensionAlimentaire.label'},
        help: {key: 'question.recoisEntierementPensionAlimentaire.help'},
        extraHelp: {key: 'question.recoisEntierementPensionAlimentaire.extraHelp'},
        errorLabels: {required: {key: 'question.recoisEntierementPensionAlimentaire.error.required'}},
        inline: true,
        radioOptions: REPONSE_BINAIRE_OPTIONS
      }),
      calculateRefus: QuestionUtils.rejectPrestationByOptionAnswerFn(
        'recoisEntierementPensionAlimentaire',
        ReponseBinaire.OUI,
        Prestation.AVANCES,
        this.demandeur,
        (eligibilite) => ({key: `question.recoisEntierementPensionAlimentaire.motifRefus.${eligibilite.prestation}`})
      ),
      eligibilites: eligibiliteGroup.findByPrestation(Prestation.AVANCES),
      categorie: Categorie.PENSION_ALIMENTAIRE
    }
    ];
  }
}
