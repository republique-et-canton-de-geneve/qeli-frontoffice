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

