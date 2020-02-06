import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DeepLinkService {

  constructor(private router: Router) {
  }

  /**
   * Construit le lien profond (deep link) avec les paramètres de la requête (queryParams)
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
   * Encrypte (base64) les valeurs du formulaire
   *
   * @param data
   * @return string Chaîne encodée et compressée
   */
  encryptParams(data: {}) {
    data = this.removeEmptyJson(data);
    console.log(data);
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

  /**
   * Nettoie les clefs vides ou nulles du Json
   *
   * @param data
   */
  removeEmptyJson(data) {
    Object.entries(data).forEach(([key, val]) =>
      (val && typeof val === 'object') && this.removeEmptyJson(val) ||
      (val === null || val === "") && delete data[key]
    );
    return data;
  };

}
