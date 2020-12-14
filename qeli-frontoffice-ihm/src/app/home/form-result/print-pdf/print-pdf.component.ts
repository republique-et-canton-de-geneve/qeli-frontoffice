import { Component, Input, OnInit, ViewChild } from '@angular/core';
import * as FileSaver from 'file-saver';
import { PDFGenerationService } from '../../../service/pdf-generation.service';
import { FormData } from '../../../dynamic-question/model/question.model';
import { FormResult } from '../../../service/question/result.model';
import { Demandeur } from '../../../service/configuration/demandeur.model';
import { CaptchaComponent } from 'angular-captcha';

@Component({
  selector: 'print-pdf',
  templateUrl: './print-pdf.component.html',
  styleUrls: ['./print-pdf.component.scss']
})
export class PrintPdfComponent implements OnInit {
  @Input() formData: FormData;
  @Input() formResult: FormResult;
  @Input() demandeur: Demandeur;

  @ViewChild(CaptchaComponent, {static: true}) captchaComponent: CaptchaComponent;


  constructor(private pdfGenerationService: PDFGenerationService) {
  }

  ngOnInit(): void {
    // set the captchaEndpoint property to point to
    // the captcha endpoint path on your app's backend
    this.captchaComponent.captchaEndpoint = '/socialqeli_pub/api/captcha';
  }


  generatePDF() {
    const userEnteredCaptchaCode = this.captchaComponent.userEnteredCaptchaCode,
          captchaId              = this.captchaComponent.captchaId;

    this.pdfGenerationService.generatePDF(
      this.formData,
      this.formResult,
      this.demandeur,
      userEnteredCaptchaCode,
      captchaId
    ).subscribe(response => {
      const blob = new Blob([(response)], {type: 'application/pdf'});
      FileSaver.saveAs(blob, 'recapitulatif-questionaire-eligibilite.pdf');
    }, err => {
      this.captchaComponent.reloadImage();
      // TODO Montrer une popup avec l'erreur
      console.log('error : ', err);
    });
  }
}
