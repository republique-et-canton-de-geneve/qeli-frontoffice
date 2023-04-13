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

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { QeliConfiguration } from './qeli-configuration.model';

@Injectable({
  providedIn: 'root'
})
export class QeliConfigurationService {

  private readonly _resourceUrl = '/socialqeli_pub/api/configuration';
  private _configuration$: Subject<QeliConfiguration>;

  constructor(private http: HttpClient) {

  }

  /**
   * La configuration de l'application.
   */
  get configuration(): Observable<QeliConfiguration> {
    if (!this._configuration$) {
      this._configuration$ = new ReplaySubject();
      this.http
          .get(this._resourceUrl, {})
          .pipe(map((response: Response) => new QeliConfiguration(response)))
          .subscribe(configuration => this._configuration$.next(configuration));
    }
    return this._configuration$;
  }
}
