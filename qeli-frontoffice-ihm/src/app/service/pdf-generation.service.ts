import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormData } from '../dynamic-question/model/question.model';
import { FormResult } from './question/result.model';
import { Demandeur } from './configuration/demandeur.model';

@Injectable({
  providedIn: 'root'
})
export class PDFGenerationService {

  constructor(private httpClient: HttpClient) {
  }

  generatePDF(answers: FormData,
              result: FormResult,
              demandeur: Demandeur,
              userEnteredCaptchaCode: string,
              captchaId: string): Observable<any> {
    return this.httpClient.post(
      '/socialqeli_pub/api/pdf', {
        answers: answers,
        result: result,
        demandeur: demandeur
      }, {
        responseType: 'blob',
        params: {
          userEnteredCaptchaCode: userEnteredCaptchaCode,
          captchaId: captchaId
        }
      }
    );
  }
}

