import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QeliState, QeliStateSchema } from '../service/question/qeli-state.model';

@Injectable({
  providedIn: 'root'
})
export class DeepLinkService {

  constructor(private router: Router) {
  }

  /**
   * Retourne le lien profond de la page qui est affichée en ce moment.
   */
  get currentDeepLink() {
    return location.href;
  }

  /**
   *
   * @param state
   * @param route
   */
  updateUrl(state: QeliStateSchema, route: ActivatedRoute): void {
    this.router.navigate([], {
      queryParams: {data: this.encryptParams(state)},
      relativeTo: route
    });
  }

  private encryptParams(data: any) {
    return btoa(JSON.stringify(data));
  }

  /**
   * Décrypte les paramètres de la requête (queryParam)
   *
   * @param queryParams {}|null
   */
  decryptQueryParamsData(queryParams: any): QeliStateSchema {
    return queryParams && queryParams['data'] ? JSON.parse(atob(queryParams['data'])) : null;
  }

}
