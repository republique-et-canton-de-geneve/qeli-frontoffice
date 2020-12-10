import { AnswerUtils } from './answer-utils';
import { TypeEnfant } from './enfants/type-enfant.model';
import { Prestation } from '../configuration/prestation.model';
import { FormResult, Result, resultsComparator } from './result.model';
import { I18nString } from '../../core/i18n/i18nstring.model';
import { QeliStateMachine } from './qeli-state.model';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { Scolarite } from './formation/scolarite.model';

@Injectable({
  providedIn: 'root'
})
export class FormResultService {
  constructor(private translate: TranslateService) {

  }

  toFormResult(qeliStateMachine: QeliStateMachine) {
    const formResult: FormResult = {
      prestationsEligibles: [],
      prestationsDejaPercues: [],
      prestationsRefusees: []
    };

    const state = qeliStateMachine.state;

    const conjointEnfantsPropres = state.demandeur.enfants.some(enfant =>
      AnswerUtils.isEnfantType(state.formData, enfant.id, TypeEnfant.AUTRE_PARENT)
    );

    Object.values(Prestation).filter(prestation => prestation !== Prestation.SUBVENTION_HM).forEach(prestation => {
      const results: Result[] = [];

      qeliStateMachine.currentEligibilites.filter(
        eligibilite => eligibilite.prestation === prestation
      ).map(
        eligibilite => ({membre: state.demandeur.findMembrebyId(eligibilite.membreId), eligible: true})
      ).forEach(result => results.push(result));

      state.eligibilitesRefusees.filter(eligibiliteRefusee =>
        eligibiliteRefusee.eligibilite.prestation === prestation
      ).map(eligibiliteRefusee => ({
        membre: state.demandeur.findMembrebyId(eligibiliteRefusee.eligibilite.membreId),
        eligible: false,
        dejaPercue: eligibiliteRefusee.dejaPercue,
        motifRefus: eligibiliteRefusee.motif
      })).forEach(result => {
        if (result.motifRefus && ![Prestation.BOURSES, Prestation.SUBSIDES].includes(prestation)) {
          const translateMotif = (i18n: I18nString) => this.translate.instant(i18n.key, i18n.parameters);
          const translatedResultMotif = translateMotif(result.motifRefus);
          if (!results.some(r => r.motifRefus && translateMotif(r.motifRefus) === translatedResultMotif)) {
            results.push(result);
          }
        } else {
          results.push(result);
        }
      });

      results
        .filter(result => result.membre.id === 0)
        .forEach(result => {
          result.conjointEnfantsPropres = conjointEnfantsPropres;
          if (prestation === Prestation.BOURSES) {
            (result as Result).enfants11P = state.demandeur.enfants.filter(
              enfant => AnswerUtils.isScolarite(state.formData, enfant.id, Scolarite.SCOLARITE_OBLIGATOIRE_11P)
            );
          }
        });

      if (results.some(result => result.eligible)) {
        formResult.prestationsEligibles.push({
          prestation: prestation,
          results: results.sort(resultsComparator).reverse()
        });
      } else if (results.every(result => result.dejaPercue)) {
        formResult.prestationsDejaPercues.push({prestation: prestation, results: results});
      } else {
        formResult.prestationsRefusees.push({prestation: prestation, results: results});
      }
    });

    return formResult;
  }
}
