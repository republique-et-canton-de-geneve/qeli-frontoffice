import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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
   * @param route
   */
  updateUrl(data: any, route: ActivatedRoute): void {
    this.router.navigate([], {
      queryParams: {data: this.encryptParams(data)},
      relativeTo: route
    });
  }


  /**
   * Encrypte (base64) les valeurs du formulaire
   *
   * @param data
   *
   * @return string Chaîne encodée et compressée
   */
  encryptParams(data: any) {
    data = this.removeEmptyJson(data);
    return btoa(JSON.stringify(data));
  }

  /**
   * Décrypte les paramètres de la requête (queryParam)
   *
   * @param queryParams {}|null
   */
  decryptQueryParamsData(queryParams: any) {
    return queryParams && queryParams['data'] ? JSON.parse(atob(queryParams['data'])) : null;
  }

  /**
   * Nettoie les clefs vides ou nulles du Json
   *
   * @param data
   */
  removeEmptyJson(data: any) {
    Object.entries(data).forEach(([key, val]) =>
      (val && typeof val === 'object') && this.removeEmptyJson(val) ||
      (val === null || val === "") && delete data[key]
    );
    return data;
  };

}
