import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DeepLinkService {

  constructor(private router: Router) {
  }

  /**
   * Construit le lien profond (deep dInk) avec les paramètres de la requête (queryParams)
   *
   * @return string L'URL courante
   */
  getCurrentDeepLink() {
    return location.href;
  }

  /**
   * Met à jour l'URL courante avec les valeurs du formulaire encryptés en paramètres de la requête (queryParams)
   *
   * @param data {}
   */
  updateUrl(data: {}): void {
    this.router.navigate([], {queryParams: {data: this.encryptParams(data)}});
  }


  /**
   * Encrypte (base64) et compresse (gwip) les valeurs du formulaire
   *
   * @param data
   * @return string Chaîne encodée et compressée
   */
  encryptParams(data: {}) {
    return btoa(JSON.stringify(data));
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
