import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Eligibilite, EligibiliteRefusee } from './question/eligibilite.model';
import { FormData } from '../dynamic-question/model/quesiton.model';

@Injectable({
  providedIn: 'root'
})
export class PersistenceService {

  constructor(private httpClient: HttpClient) {
  }

  persistData(answers: FormData,
              eligibilites: Eligibilite[],
              eligibiliteRefusees: EligibiliteRefusee[]): Observable<any> {
    return this.httpClient.post(
      '/socialqeli_pub/api/persistData',
      {answers: answers, eligibilites: eligibilites, eligibiliteRefusees: eligibiliteRefusees}
    );
  }
}
