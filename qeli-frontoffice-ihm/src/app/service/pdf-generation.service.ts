import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Eligibilite, EligibiliteRefusee } from './question/eligibilite.model';
import { FormData } from '../dynamic-question/model/question.model';

@Injectable({
  providedIn: 'root'
})
export class PDFGenerationService {

  constructor(private httpClient: HttpClient) {
  }

  generatePDF(answers: FormData,
              eligibilites: Eligibilite[],
              eligibiliteRefusees: EligibiliteRefusee[]): Observable<any> {
    return this.httpClient.post(
      '/socialqeli_pub/api/pdf',
      {answers: answers, eligibilites: eligibilites, eligibiliteRefusees: eligibiliteRefusees},
      {responseType: 'blob'}
    );
  }
}

