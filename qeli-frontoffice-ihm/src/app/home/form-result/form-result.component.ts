import {  ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Eligibilite, EligibiliteRefusee } from '../../service/question/eligibilite.model';
import { QeliStateMachine } from '../../service/question/qeli-state.model';
import { TranslateService } from '@ngx-translate/core';
import { PDFGenerationService } from '../../service/pdf-generation.service';
import { FormData } from '../../dynamic-question/model/quesiton.model';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-form-result',
  templateUrl: './form-result.component.html',
  styleUrls: ['./form-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormResultComponent {
  eligibilites: Eligibilite[];
  eligibilitesRefusees: EligibiliteRefusee[];
  formData: FormData;

  constructor(private translateService: TranslateService,
              private pdfGenerationService: PDFGenerationService) {

  }

  @Input()
  set qeliStateMachine(qeliStateMachine: QeliStateMachine) {
    const state = qeliStateMachine.state;
    this.eligibilites = qeliStateMachine.currentEligibilites;
    this.eligibilitesRefusees = state.eligibilitesRefusees;
    this.formData = state.formData;
  }

  get dejaPercues() {
    return this.eligibilitesRefusees.filter(e => e.dejaPercue).map(e => e.eligibilite);
  }


  get refusees() {
    return this.eligibilitesRefusees.filter(e => !e.dejaPercue);
  }

  get eligibiles() {
    return this.eligibilites.map(eligibilite => eligibilite.prestation);
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
