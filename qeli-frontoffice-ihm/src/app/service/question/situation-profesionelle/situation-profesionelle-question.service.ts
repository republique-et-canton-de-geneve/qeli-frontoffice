import { QuestionLoader } from '../question-loader';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { Categorie, QeliQuestionDecorator, Subcategorie } from '../qeli-question-decorator.model';
import { EligibiliteGroup } from '../eligibilite.model';
import { RadioQuestion } from '../../../dynamic-question/radio-question/radio-question.model';
import { REPONSE_PROGRESSIVE_OPTIONS, ReponseBinaire, ReponseProgressive } from '../reponse-binaire.model';
import { Prestation } from '../../configuration/prestation.model';
import { TauxAnswer, TauxQuestion } from '../../../dynamic-question/taux-question/taux-question.model';
import { I18nString } from '../../../core/i18n/i18nstring.model';
import { Personne } from '../../configuration/demandeur.model';
import { TypeEnfant } from '../enfants/type-enfant.model';
import { AnswerUtils } from '../answer-utils';
import { TypeRevenus } from '../revenus/revenus.model';
import { FormData } from '../../../dynamic-question/model/question.model';
import { OptionAnswer } from '../../../dynamic-question/model/answer.model';
import { QuestionUtils } from '../qeli-questions.utils';

export class SituationProfesionelleQuestionService extends QuestionLoader {

  loadQuestions(configuration: QeliConfiguration): QeliQuestionDecorator<any>[] {
    const eligibiliteGroup = new EligibiliteGroup(this.demandeur.toEligibilite());

    const questions: QeliQuestionDecorator<any>[] = [{
      question: new RadioQuestion({
        key: 'taxationOffice',
        dataCyIdentifier: '0901_taxationOffice',
        label: (value: any) => {
          const hasConcubin = this.demandeur.hasConcubin && this.hasEnfantEnCommun(value);
          return {
            key: 'question.taxationOffice.label',
            parameters: {
              hasConcubin: hasConcubin ? 'yes' : 'no',
              membre: hasConcubin ? this.demandeur.partenaire.prenom : ''
            }
          } as I18nString;
        },
        help: {key: 'question.taxationOffice.help'},
        errorLabels: {required: {key: 'question.taxationOffice.error.required'}},
        inline: true,
        radioOptions: REPONSE_PROGRESSIVE_OPTIONS
      }),
      calculateRefus: QuestionUtils.rejectPrestationByOptionAnswerFn(
        'taxationOffice',
        ReponseProgressive.OUI,
        Prestation.PC_FAM,
        (eligibilite) => ({key: `question.taxationOffice.motifRefus.${eligibilite.prestation}`})
      ),
      eligibilites: eligibiliteGroup.findByPrestation(Prestation.PC_FAM),
      categorie: Categorie.COMPLEMENTS,
      subcategorie: Subcategorie.SITUATION_PROFESSIONNELLE
    }];


    const membres: Personne[] = [
      this.demandeur, this.demandeur.partenaire
    ].filter(membre => membre !== null && membre !== undefined);

    return questions.concat(
      membres.map((membre): QeliQuestionDecorator<any>[] => {
        const translateParams = {who: membre.id === 0 ? 'me' : 'them', membre: membre.prenom};
        return [{
          question: new TauxQuestion({
            key: `tauxActivite_${membre.id}`,
            dataCyIdentifier: `0902_tauxActivite_${membre.id}`,
            label: {
              key: 'question.tauxActivite.label',
              parameters: translateParams
            },
            help: {
              key: 'question.tauxActivite.help',
              parameters: translateParams
            },
            errorLabels: QuestionUtils.toErrorLabels(
              'tauxActivite', ['required', 'pattern', 'min', 'max'], translateParams
            )
          }),
          skip: (formData) => !AnswerUtils.hasAnyRevenus(formData, membre, [TypeRevenus.EMPLOI]) &&
                              !AnswerUtils.isRevenuInconnu(formData, (membre))
          ,
          calculateRefus: QuestionUtils.rejectPrestationFn(
            (formData: FormData) => {
              if (membre.id === 0 &&
                  this.isFormeFamilleAvecPartenaire(formData) &&
                  this.isPartenaireActif(formData)) {
                return false;
              }

              let taux = this.sumTauxActiviteByKeys(formData, `tauxActivite_${membre.id}`);
              if (membre.id !== 0) {
                taux += this.sumTauxActiviteByMembre(formData, this.demandeur);
              }

              return !AnswerUtils.hasAnyRevenus(formData, membre, [TypeRevenus.CHOMAGE, TypeRevenus.APG]) &&
                     !AnswerUtils.isRevenuInconnu(formData, membre) &&
                     taux < this.getMinTauxActiviteBySituation(formData, configuration);
            },
            Prestation.PC_FAM,
            (eligibilite) => ({key: `question.tauxActivite.motifRefus.${eligibilite.prestation}`})
          ),
          eligibilites: eligibiliteGroup.findByPrestation(Prestation.PC_FAM),
          categorie: Categorie.COMPLEMENTS,
          subcategorie: Subcategorie.SITUATION_PROFESSIONNELLE
        }, {
          question: new TauxQuestion({
            key: `tauxActiviteDernierEmploi_${membre.id}`,
            dataCyIdentifier: `0903_tauxActiviteDernierEmploi_${membre.id}`,
            label: {
              key: 'question.tauxActiviteDernierEmploi.label',
              parameters: translateParams
            },
            errorLabels: QuestionUtils.toErrorLabels(
              'tauxActiviteDernierEmploi', ['required', 'pattern', 'min', 'max'], translateParams
            )
          }),
          skip: (formData) => !AnswerUtils.hasAnyRevenus(formData, membre, [TypeRevenus.CHOMAGE, TypeRevenus.APG]) &&
                              !AnswerUtils.isRevenuInconnu(formData, membre),
          calculateRefus: () => [],
          eligibilites: eligibiliteGroup.findByPrestation(Prestation.PC_FAM),
          categorie: Categorie.COMPLEMENTS,
          subcategorie: Subcategorie.SITUATION_PROFESSIONNELLE
        }, {
          question: new RadioQuestion({
            key: `tauxActiviteVariable6DernierMois_${membre.id}`,
            dataCyIdentifier: `0912_tauxActiviteVariable6DernierMois_${membre.id}`,
            label: {
              key: 'question.tauxActiviteVariable6DernierMois.label',
              parameters: translateParams
            },
            errorLabels: {required: {key: 'question.tauxActiviteVariable6DernierMois.error.required'}},
            inline: true,
            radioOptions: Object.keys(ReponseBinaire).map(reponse => ({
              value: reponse,
              label: {
                key: `question.tauxActiviteVariable6DernierMois.option.${reponse}`,
                parameters: translateParams
              }
            }))
          }),
          skip: (formData) => {
            let taux = this.sumTauxActiviteByKeys(
              formData, [
                `tauxActivite_${membre.id}`,
                `tauxActiviteDernierEmploi_${membre.id}`
              ]
            );

            if (membre.id !== 0) {
              taux += this.sumTauxActiviteByMembre(formData, this.demandeur);
            }

            return taux >= this.getMinTauxActiviteBySituation(formData, configuration) ||
                   (!AnswerUtils.hasAnyRevenus(formData, membre, [TypeRevenus.CHOMAGE, TypeRevenus.APG]) &&
                    !AnswerUtils.isRevenuInconnu(formData, membre));
          },
          calculateRefus: QuestionUtils.rejectPrestationFn(
            (formData: FormData) => {
              if (membre.id === 0 &&
                  this.isFormeFamilleAvecPartenaire(formData) &&
                  this.isPartenaireActif(formData)) {
                return false;
              }

              const choosenOption = (formData[`tauxActiviteVariable6DernierMois_${membre.id}`] as OptionAnswer<string>).value;
              return choosenOption.value === ReponseBinaire.NON;
            },
            Prestation.PC_FAM,
            (eligibilite) => ({key: `question.tauxActiviteVariable6DernierMois.motifRefus.${eligibilite.prestation}`})
          ),
          eligibilites: eligibiliteGroup.findByPrestation(Prestation.PC_FAM),
          categorie: Categorie.COMPLEMENTS,
          subcategorie: Subcategorie.SITUATION_PROFESSIONNELLE
        }, {
          question: new TauxQuestion({
            key: `tauxActiviteMoyen6DernierMois_${membre.id}`,
            dataCyIdentifier: `0905_tauxActiviteMoyen6DernierMois_${membre.id}`,
            label: {
              key: 'question.tauxActiviteMoyen6DernierMois.label',
              parameters: translateParams
            },
            errorLabels: QuestionUtils.toErrorLabels(
              'tauxActiviteMoyen6DernierMois', ['required', 'pattern', 'min', 'max'], translateParams
            )
          }),
          skip: (formData) => {
            const isTauxVariableAnswer = (formData[`tauxActiviteVariable6DernierMois_${membre.id}`] as OptionAnswer<string>)
            const choosenOption = isTauxVariableAnswer ? isTauxVariableAnswer.value : null;
            return !choosenOption || choosenOption.value === ReponseBinaire.NON;
          },
          calculateRefus: QuestionUtils.rejectPrestationFn(
            (formData: FormData) => {
              if (membre.id === 0 &&
                  this.isFormeFamilleAvecPartenaire(formData) &&
                  this.isPartenaireActif(formData)) {
                return false;
              }

              return !this.isTauxActiviteSuffissant(formData, configuration);
            },
            Prestation.PC_FAM,
            (eligibilite) => ({key: `question.tauxActiviteMoyen6DernierMois.motifRefus.${eligibilite.prestation}`})
          ),
          eligibilites: eligibiliteGroup.findByPrestation(Prestation.PC_FAM),
          categorie: Categorie.COMPLEMENTS,
          subcategorie: Subcategorie.SITUATION_PROFESSIONNELLE
        }];
      }).reduce((result, current) => result.concat(current), [])
    );
  }

  hasEnfantEnCommun(value: any) {
    const answers = value['parentsEnfants'];
    return this.demandeur.enfants.some(membre => answers[`parentsEnfants_${membre.id}`] === TypeEnfant.LES_DEUX);
  }

  isFormeFamilleAvecPartenaire(formData: FormData) {
    return this.demandeur.hasConjoint || (this.demandeur.hasConcubin && AnswerUtils.hasEnfantEnCommun(formData));
  }

  isPartenaireActif(formData: FormData) {
    return AnswerUtils.isRevenuInconnu(formData, this.demandeur.partenaire) ||
           AnswerUtils.hasAnyRevenus(
             formData,
             this.demandeur.partenaire,
             [TypeRevenus.EMPLOI, TypeRevenus.CHOMAGE, TypeRevenus.APG]
           );
  }

  getTauxActiviteByKey(formData: FormData, questionKey: string): number {
    const answer = (formData[questionKey] as TauxAnswer);
    return answer ? answer.value : 0;
  }

  sumTauxActiviteByKeys(formData: FormData, keys: string | string[]) {
    const arrayOfKeys = Array.isArray(keys) ? keys as string[] : [keys as string];
    return arrayOfKeys.map(key => this.getTauxActiviteByKey(formData, key)).reduce((c, r) => c + r, 0);
  }

  getMinTauxActiviteBySituation(formData: FormData, configuration: QeliConfiguration) {
    return this.isFormeFamilleAvecPartenaire(formData) ?
           configuration.minTauxActiviteAvecConjoint :
           configuration.minTauxActiviteSeul;
  }

  sumTauxActiviteByMembre(formData: FormData, membre: Personne) {
    const isTauxVariableAnswer = (formData[`tauxActiviteVariable6DernierMois_${membre.id}`] as OptionAnswer<string>);
    const useTauxVariable = isTauxVariableAnswer && isTauxVariableAnswer.value.value === ReponseBinaire.OUI;

    return this.sumTauxActiviteByKeys(
      formData, [
        `tauxActivite_${membre.id}`
      ].concat(
        useTauxVariable ?
        `tauxActiviteMoyen6DernierMois_${membre.id}` :
        `tauxActiviteDernierEmploi_${membre.id}`
      )
    );
  }

  isTauxActiviteSuffissant(formData: FormData, configuration: QeliConfiguration) {
    let taux = this.sumTauxActiviteByMembre(formData, this.demandeur);

    if (this.isFormeFamilleAvecPartenaire(formData)) {
      taux += this.sumTauxActiviteByMembre(formData, this.demandeur.partenaire);
    }

    return taux >= this.getMinTauxActiviteBySituation(formData, configuration);
  }
}
