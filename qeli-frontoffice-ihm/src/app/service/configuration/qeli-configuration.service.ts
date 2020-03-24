import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { QeliConfiguration } from './qeli-configuration.model';

@Injectable({
  providedIn: 'root'
})
export class QeliConfigurationService {

  constructor(private http: HttpClient) {
  }

  loadConfiguration(): Observable<QeliConfiguration> {
    return this.http.get('/socialqeli_pub/api/configuration/').pipe(
      map((response: Response) => new QeliConfiguration(response))
    );
  }
}
