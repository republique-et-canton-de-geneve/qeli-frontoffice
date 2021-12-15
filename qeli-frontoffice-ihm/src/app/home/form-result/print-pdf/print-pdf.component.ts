/*
 * qeli-frontoffice
 *
 * Copyright (C) 2019-2021 Republique et canton de Geneve
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import * as FileSaver from 'file-saver';
import { PDFGenerationService } from '../../../service/pdf-generation.service';
import { FormData } from '../../../dynamic-question/model/question.model';
import { FormResult } from '../../../service/question/result.model';
import { Demandeur } from '../../../service/configuration/demandeur.model';
import { CaptchaComponent } from 'angular-captcha';

@Component({
  selector: 'print-pdf',
  templateUrl: './print-pdf.component.html',
  styleUrls: ['./print-pdf.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class PrintPdfComponent implements OnInit {
  @Input() formData: FormData;
  @Input() formResult: FormResult;
  @Input() demandeur: Demandeur;

  @ViewChild(CaptchaComponent, {static: true}) captchaComponent: CaptchaComponent;

  inError: boolean = false;
  success: boolean = false;

  constructor(private pdfGenerationService: PDFGenerationService,
              private ref: ChangeDetectorRef) {
  }

  ngOnInit(): void {
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
      this.inError = false;
      this.success = true;
      this.ref.markForCheck();
      const blob = new Blob([(response)], {type: 'application/pdf'});
      FileSaver.saveAs(blob, 'recapitulatif-questionaire-eligibilite.pdf');
      this.captchaComponent.reloadImage();
    }, err => {
      this.inError = true;
      this.success = false;
      this.ref.markForCheck();
      this.captchaComponent.reloadImage();
    });
  }
}
