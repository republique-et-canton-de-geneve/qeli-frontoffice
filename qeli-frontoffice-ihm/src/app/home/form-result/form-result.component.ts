import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { QeliStateMachine } from '../../service/question/qeli-state.model';
import { TranslateService } from '@ngx-translate/core';
import { PDFGenerationService } from '../../service/pdf-generation.service';
import { FormData } from '../../dynamic-question/model/question.model';
import { Prestation } from '../../service/configuration/prestation.model';
import { Eligibilite, EligibiliteRefusee } from '../../service/question/eligibilite.model';
import * as FileSaver from 'file-saver';
import { Result, ResultsByPrestation, resultsComparator } from './result-block/result.model';
import { I18nString } from '../../core/i18n/i18nstring.model';
import { AnswerUtils } from '../../service/question/answer-utils';
import { Relation } from '../../service/configuration/demandeur.model';
import { TypeEnfant } from '../../service/question/enfants/type-enfant.model';

@Component({
  selector: 'app-form-result',
  templateUrl: './form-result.component.html',
  styleUrls: ['./form-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormResultComponent {
  formData: FormData;

  prestationEligibles: ResultsByPrestation[] = [];
  prestationRefusees: ResultsByPrestation[] = [];
  prestationDejaPercues: ResultsByPrestation[] = [];
  @Input() canSavePDF: boolean = true;
  @Input() disableDeepLink: boolean = false;

  private eligibilites: Eligibilite[];
  private eligibilitesRefusees: EligibiliteRefusee[];

  constructor(private translateService: TranslateService,
              private pdfGenerationService: PDFGenerationService) {

  }

  @Input()
  set qeliStateMachine(qeliStateMachine: QeliStateMachine) {
    const state = qeliStateMachine.state;

    // TODO Create a service for the mapping

    const enfants = state.demandeur.membresFamille.filter(membre => membre.relation === Relation.ENFANT);
    const conjointEnfantsPropres = enfants.some(enfant =>
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
          const translateMotif = (i18n: I18nString) => this.translateService.instant(i18n.key, i18n.parameters);
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
        .forEach(result => result.conjointEnfantsPropres = conjointEnfantsPropres);

      if (results.some(result => result.eligible)) {
        this.prestationEligibles.push({
          prestation: prestation,
          results: results.sort(resultsComparator).reverse()
        });
      } else if (results.every(result => result.dejaPercue)) {
        this.prestationDejaPercues.push({prestation: prestation, results: results});
      } else {
        this.prestationRefusees.push({prestation: prestation, results: results});
      }
    });

    this.eligibilites = qeliStateMachine.currentEligibilites;
    this.eligibilitesRefusees = state.eligibilitesRefusees;

    this.formData = state.formData;
  }

  generatePDF() {
    this.pdfGenerationService.generatePDF(
      this.formData,
      this.eligibilites,
      this.eligibilitesRefusees
    ).subscribe(response => {
      const blob = new Blob([(response)], {type: 'application/pdf'});
      FileSaver.saveAs(blob, 'recapitulatif-questionaire-eligibilite.pdf');
    }, err => {
      // TODO Montrer une popup avec l'erreur
      console.log('error : ', err);
    });
  }
}
