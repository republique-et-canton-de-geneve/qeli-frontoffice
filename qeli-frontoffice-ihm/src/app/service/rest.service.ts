import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FlattenData } from '../core/common/form-state.model';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private httpClient: HttpClient) { }

  generatePDF(documentContent: FlattenData): Observable<any> {


    return this.httpClient.post(
      '/socialqeli_pub/api/pdf',
      {documentContent: documentContent},
      {
        responseType: 'blob'
      });
  }

}

