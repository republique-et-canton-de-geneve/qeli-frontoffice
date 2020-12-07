import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormData } from '../dynamic-question/model/question.model';
import { Demandeur } from './configuration/demandeur.model';
import { FormResult } from './question/result.model';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  constructor(private httpClient: HttpClient) {
  }

  saveStats(answers: FormData,
            result: FormResult,
            demandeur: Demandeur): Observable<any> {
    return this.httpClient.post('/socialqeli_pub/api/saveStats', {
      answers: answers,
      result: result,
      demandeur: demandeur
    });
  }
}
