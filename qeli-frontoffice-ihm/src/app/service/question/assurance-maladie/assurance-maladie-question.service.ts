import { QuestionLoader } from '../question-loader';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { Categorie, QeliQuestionDecorator, Subcategorie } from '../qeli-question-decorator.model';
import { Eligibilite, EligibiliteGroup, EligibiliteRefusee } from '../eligibilite.model';
import {
  CompositeAnswer, CompositeQuestion
} from '../../../dynamic-question/composite-question/composite-question.model';
import { RadioQuestion } from '../../../dynamic-question/radio-question/radio-question.model';
import { Prestation } from '../../configuration/prestation.model';
import { Personne } from '../../configuration/demandeur.model';
import { REPONSE_PROGRESSIVE_OPTIONS, ReponseProgressive } from '../reponse-binaire.model';
import { FormData } from '../../../dynamic-question/model/question.model';
import { OptionAnswer } from '../../../dynamic-question/model/answer.model';

export class AssuranceMaladieQuestionService extends QuestionLoader {

  loadQuestions(configuration: QeliConfiguration): QeliQuestionDecorator<any>[] {
    const eligibiliteGroup = new EligibiliteGroup(this.demandeur.toEligibilite());
    const membres: Personne[] = (
      [this.demandeur] as Personne[]
    ).concat(this.demandeur.membresFamille);

    return [{
      question: new CompositeQuestion({
        key: 'assuranceMaladieSuisse',
        dataCyIdentifier: '1101_assuranceMaladieSuisse',
        label: {
          key: 'question.assuranceMaladieSuisse.label',
          parameters: {numberOfMemebres: this.demandeur.membresFamille.length}
        },
        help: {key: 'question.assuranceMaladieSuisse.help'},
        showErrors: false,
        items: membres.map(membre => ({
          question: new RadioQuestion({
            key: `assuranceMaladieSuisse_${membre.id}`,
            dataCyIdentifier: `1101_assuranceMaladieSuisse_${membre.id}`,
            label: {
              key: 'question.assuranceMaladieSuisse.membre',
              parameters: {
                who: membre.id === 0 ? 'me' : 'them',
                membre: membre.prenom
              }
            },
            errorLabels: {required: {key: 'question.assuranceMaladieSuisse.error.required'}},
            inline: true,
            radioOptions: REPONSE_PROGRESSIVE_OPTIONS
          }),
          isShown: this.hasNotSubsidesFn(membre)
        }))
      }),
      calculateRefus: this.calculateRefus,
      eligibilites: eligibiliteGroup.findByPrestation(Prestation.SUBSIDES),
      categorie: Categorie.SITUATION_PERSONELLE,
      subcategorie: Subcategorie.ASSURANCE_MALADIE
    }];
  }

  private hasNotSubsidesFn(membre: Personne) {
    return (value: any) => {
      const prestation = value['prestations'];
      const choices = prestation['choices'] || [];
      return !choices.includes(`SUBSIDES_${membre.id}`);
    }
  };

  private calculateRefus(formData: FormData, eligibilites: Eligibilite[]): EligibiliteRefusee[] {
    const answers = (formData['assuranceMaladieSuisse'] as CompositeAnswer).answers;
    const eligibiliteGroup = new EligibiliteGroup(eligibilites);

    return eligibiliteGroup.findByPrestation(Prestation.SUBSIDES).filter(eligibilite => {
      const answer = (answers[`assuranceMaladieSuisse_${eligibilite.membre.id}`] as OptionAnswer<string>);
      const choice = answer ? answer.value : null;

      return choice && choice.value === ReponseProgressive.NON;
    }).map(eligibilite => ({
      eligibilite: eligibilite,
      motif: {
        key: `question.assuranceMaladieSuisse.motifRefus.${Prestation.SUBSIDES}`,
        parameters: {
          who: eligibilite.membre.id === 0 ? 'me' : 'them',
          membre: eligibilite.membre.prenom
        }
      }
    }));

  }
}
