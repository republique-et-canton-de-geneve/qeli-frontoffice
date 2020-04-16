import { Injectable } from '@angular/core';
import { QuestionLoader } from '../question-loader';
import { QeliConfiguration } from '../../configuration/qeli-configuration.model';
import { Categorie, QeliQuestionDecorator, Subcategorie } from '../qeli-question-decorator.model';
import { Eligibilite, EligibiliteGroup, EligibiliteRefusee } from '../eligibilite.model';
import { Demandeur, MembreFamille } from '../../configuration/demandeur.model';
import { Prestation } from '../../configuration/prestation.model';
import { ReponseProgressive } from '../reponse-binaire.model';
import { RadioQuestion } from '../../../dynamic-question/radio-question/radio-question.model';
import { FormData } from '../../../dynamic-question/model/question.model';
import { OptionAnswer } from '../../../dynamic-question/model/answer.model';
import { RequerantRefugie } from '../nationalite/requerant-refugie.model';

@Injectable({
  providedIn: 'root'
})
export class SituationFiscaleQuestionService implements QuestionLoader {

  loadQuestions(configuration: QeliConfiguration, eligibilites: Eligibilite[]): QeliQuestionDecorator<any>[] {

    const eligibiliteGroup = new EligibiliteGroup(eligibilites);
    const membres = ([eligibiliteGroup.demandeur] as (MembreFamille | Demandeur)[]).concat(
      eligibiliteGroup.demandeur.membresFamille
    );
    return membres.map((membre): QeliQuestionDecorator<any>[] => {
      const translateParams = {who: membre.id === 0 ? 'me' : 'them', membre: membre.prenom};
      return [
        {
          question: new RadioQuestion({
            key: `fonctionnaireInternational_${membre.id}`,
            help: {
              key: 'question.fonctionnaireInternational.help',
              parameters: translateParams
            },
            dataCyIdentifier: `1403_fonctionnaireInternational_${membre.id}`,
            label: {
              key: 'question.fonctionnaireInternational.label',
              parameters: translateParams
            },
            radioOptions: Object.keys(ReponseProgressive).map(reponse => ({
              value: reponse,
              label: {key: `common.reponseProgressive.${reponse}`}
            })),

          }),
          calculateRefus: this.calculatefonctionnaireInternationalRefusFn(membre),
          eligibilites: eligibiliteGroup.findByPrestationEtMembre([
            Prestation.BOURSES], membre),
          categorie: Categorie.SITUATION_PERSONELLE,
          subcategorie: Subcategorie.SITUATION_FISCALE,
          skip: formData => (formData[`refugie_${membre.id}`] as OptionAnswer<RequerantRefugie>).value.value
                            === RequerantRefugie.REFUGIE
        }
      ];
    }).reduce((result, current) => result.concat(current), []);
  }

  private calculatefonctionnaireInternationalRefusFn(membre: MembreFamille | Demandeur) {
    return (formData: FormData, eligibilites: Eligibilite[]): EligibiliteRefusee[] => {
      const refus: EligibiliteRefusee[] = [];
      const choosenOption = (formData[`fonctionnaireInternational_${membre.id}`] as OptionAnswer<string>).value;

      if (choosenOption.value === ReponseProgressive.OUI) {
        this.createRefusByPrestation(
          [Prestation.BOURSES], refus, eligibilites, membre
        ).forEach(eligibiliteRefusee => refus.push(eligibiliteRefusee));
      }
      return [];
    };
  }

  private createRefusByPrestation(prestations: Prestation[],
                                  refus: EligibiliteRefusee[],
                                  eligibilites: Eligibilite[], membre: MembreFamille | Demandeur) {
    const translateParams = {who: membre.id === 0 ? 'me' : 'them', membre: membre.prenom};
    const eligibiliteGroup = new EligibiliteGroup(eligibilites);

    prestations.forEach(prestation => {
      eligibiliteGroup.findByPrestationEtMembre(prestation, membre).forEach(eligibilite => {
        refus.push({
          eligibilite: eligibilite,
          motif: {
            key: `question.fonctionnaireInternational.motifRefus.${eligibilite.prestation}`,
            parameters: translateParams
          }
        });
      });
    });
    return refus;
  }
}




        /*
        new RadioQuestion({
          key: 'exempteImpot',
          code: '1401',
          categorie: Categorie.COMPLEMENTS,
          subcategorie: Subcategorie.SITUATION_FISCALE,
          help: true,
          inline: true,
          options: Object.keys(ReponseProgressive).map(label => ({label: label})),
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
            annee: moment().subtract(configuration.taxationAfcYearsFromNow, 'year').get('year')
          },
          options: Object.keys(ReponseProgressive).map(label => ({label: label})),
          eligibilite: [
            {
              prestation: Prestation.SUBSIDES,
              isEligible: (value: any) => value['taxeOfficeAFC'] !== ReponseProgressive.OUI
            }
          ]
        }),
        new RadioQuestion({
          key: 'm',
          code: '1403',
          categorie: Categorie.COMPLEMENTS,
          subcategorie: Subcategorie.SITUATION_FISCALE,
          help: true,
          inline: true,
          options: Object.keys(ReponseProgressive).map(label => ({label: label})),
          altText: value => hasConjoint(value) ? 'avecConjoint' : null,
          skip: (value: any) => isRefugie(value),
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
          skip: (value: any) => !hasPermisBEtudes(value),
          eligibilite: [
            {
              prestation: Prestation.BOURSES,
              isEligible: (value: any) => value['parentsHabiteFranceTravailleSuisse'] !== ReponseProgressive.NON
            }
          ]
        })*/
