import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService {

  constructor(private router: Router) {
  }

  /**
   * Met à jour l'URL courante en encryptant en base64 les paramètres de la requête (queryParams)
   *
   * @param data {}
   */
  updateUrl(data: {}): void {
    this.router.navigate(['/'], {queryParams: {data: btoa(JSON.stringify(data))}});
  }

  /**
   * Décrypte les paramètres de la requête (queryParam)
   *
   * @param queryParam {}|null
   */
  decryptQueryParamData(queryParam) {
    return queryParam && queryParam['data'] ? JSON.parse(atob(queryParam['data'])) : null;
  }

}
