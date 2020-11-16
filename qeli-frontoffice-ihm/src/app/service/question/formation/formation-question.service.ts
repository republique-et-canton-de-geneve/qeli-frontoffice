import { QuestionLoader } from '../question-loader';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { Categorie, QeliQuestionDecorator, RefusEligibiliteFn, Subcategorie } from '../qeli-question-decorator.model';
import { Eligibilite, EligibiliteGroup, EligibiliteRefusee } from '../eligibilite.model';
import { Personne, Relation } from '../../configuration/demandeur.model';
import { Prestation } from '../../configuration/prestation.model';
import { RadioQuestion } from '../../../dynamic-question/radio-question/radio-question.model';
import { REPONSE_BINAIRE_OPTIONS } from '../reponse-binaire.model';
import { Scolarite, SCOLARITE_OPTIONS } from './scolarite.model';
import { OptionAnswer } from '../../../dynamic-question/model/answer.model';
import { FormData } from '../../../dynamic-question/model/question.model';
import { CompositeQuestion } from '../../../dynamic-question/composite-question/composite-question.model';
import { AnswerUtils } from '../answer-utils';
import { QuestionUtils } from '../qeli-questions.utils';

export class FormationQuestionService extends QuestionLoader {

  loadQuestions(configuration: QeliConfiguration): QeliQuestionDecorator<any>[] {
    const eligibiliteGroup = new EligibiliteGroup(this.demandeur.toEligibilite(), this.demandeur);
    const membres = ([this.demandeur] as (Personne)[]).concat(this.demandeur.membresFamille);
    const questions: QeliQuestionDecorator<any>[] = [];

    questions.push({
      question: new CompositeQuestion({
        key: 'formation',
        dataCyIdentifier: '0702_formation',
        label: {
          key: 'question.formation.label',
          parameters: {numberOfMemebres: this.demandeur.membresFamille.length}
        },
        showErrors: false,
        items: membres.map(membre => ({
          question: new RadioQuestion({
            key: `formation_${membre.id}`,
            dataCyIdentifier: `0702_formation_${membre.id}`,
            label: {
              key: 'question.formation.membre',
              parameters: {who: membre.id === 0 ? 'me' : 'them', membre: membre.prenom}
            },
            errorLabels: QuestionUtils.toErrorLabels(`formation`, ['required']),
            inline: true,
            radioOptions: REPONSE_BINAIRE_OPTIONS
          })
        }))
      }),
      calculateRefus: this.calculateFormationRefusFn.bind(this),
      eligibilites: eligibiliteGroup.findByPrestation([Prestation.BOURSES, Prestation.PC_FAM]).concat(
        eligibiliteGroup.findByPrestationEtRelation(Prestation.PC_AVS_AI, Relation.ENFANT)
      ),
      categorie: Categorie.SITUATION_PERSONELLE,
      subcategorie: Subcategorie.FORMATION
    });

    membres.map((membre): QeliQuestionDecorator<any> => ({
      question: new RadioQuestion({
        key: `scolarite_${membre.id}`,
        dataCyIdentifier: `0701_scolarite_${membre.id}`,
        label: {
          key: 'question.scolarite.label',
          parameters: {who: membre.id === 0 ? 'me' : 'them', membre: membre.prenom}
        },
        errorLabels: {required: {key: 'question.scolarite.error.required'}},
        radioOptions: SCOLARITE_OPTIONS
      }),
      calculateRefus: this.calculateScolariteRefusFn(membre).bind(this),
      eligibilites: eligibiliteGroup.findByPrestationEtMembre(Prestation.BOURSES, membre),
      categorie: Categorie.COMPLEMENTS,
      subcategorie: Subcategorie.FORMATION
    } as QeliQuestionDecorator<any>)).forEach(question => questions.push(question));

    return questions;
  }

  calculateFormationRefusFn(formData: FormData, eligibilites: Eligibilite[]): EligibiliteRefusee[] {
    const eligibiliteGroup = new EligibiliteGroup(eligibilites, this.demandeur);
    const refus: EligibiliteRefusee[] = [];

    // Si pas d'enfant à charge, refus PC FAM
    if (!AnswerUtils.hasEnfantACharge(formData, this.demandeur)) {
      QuestionUtils.createRefusByPrestation(
        eligibiliteGroup, Prestation.PC_FAM, eligibilite => ({
          key: `question.formation.motifRefus.${eligibilite.prestation}`
        })
      ).forEach(eligibiliteRefusee => refus.push(eligibiliteRefusee));
    }

    // Refus de BOURSES pour les membre qui ne sont pas en formation
    eligibiliteGroup.findByPrestation(Prestation.BOURSES).filter(eligibilite => {
      return !AnswerUtils.isEnFormation(formData, eligibilite.membreId);
    }).map((eligibilite) => ({
        eligibilite: eligibilite,
        motif: {
          key: `question.formation.motifRefus.${eligibilite.prestation}`,
          parameters: {
            who: eligibilite.membreId === 0 ? 'me' : 'them',
            membre: this.demandeur.findMembrebyId(eligibilite.membreId).prenom
          }
        }
      } as EligibiliteRefusee)
    ).forEach(eligibiliteRefusee => refus.push(eligibiliteRefusee));

    // Refus PC AVS AI pour les enfants qui ne sont pas à charge
    eligibiliteGroup.findByPrestationEtRelation(Prestation.PC_AVS_AI, Relation.ENFANT).filter(
      eligibilite =>
        !AnswerUtils.isEnfantACharge(
          formData,
          this.demandeur.findMembrebyId(eligibilite.membreId),
          this.demandeur
        )
    ).map((eligibilite) => ({
        eligibilite: eligibilite,
        motif: {
          key: `question.formation.motifRefus.${eligibilite.prestation}`,
          parameters: {membre: this.demandeur.findMembrebyId(eligibilite.membreId).prenom}
        }
      } as EligibiliteRefusee)
    ).forEach(eligibiliteRefusee => refus.push(eligibiliteRefusee));

    return refus;
  }

  private calculateScolariteRefusFn(membre: Personne): RefusEligibiliteFn {
    return (formData: FormData, eligibilites: Eligibilite[]) => {
      const answer = (formData[`scolarite_${membre.id}`] as OptionAnswer<string>).value;

      if (answer.value === Scolarite.AUCUNE || answer.value === Scolarite.INCONNU) {
        return [];
      } else {
        return QuestionUtils.createRefusByPrestationAndMembre(
          new EligibiliteGroup(eligibilites, this.demandeur),
          Prestation.BOURSES,
          membre,
          () => ({
            key: `question.scolarite.motifRefus.${Prestation.BOURSES}`,
            parameters: {who: membre.id === 0 ? 'me' : 'them', membre: membre.prenom}
          })
        );
      }
    };
  }
}
