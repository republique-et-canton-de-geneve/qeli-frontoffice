import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Eligibilite, EligibiliteRefusee } from './question/eligibilite.model';
import { FormData } from '../dynamic-question/model/question.model';
import { Demandeur } from './configuration/demandeur.model';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  constructor(private httpClient: HttpClient) {
  }

  saveStats(answers: FormData,
            eligibilites: Eligibilite[],
            eligibiliteRefusees: EligibiliteRefusee[],
            demandeur: Demandeur): Observable<any> {
    return this.httpClient.post('/socialqeli_pub/api/saveStats', {
      answers: answers,
      eligibilites: eligibilites,
      eligibiliteRefusees: eligibiliteRefusees,
      demandeur: demandeur
    });
  }
}
