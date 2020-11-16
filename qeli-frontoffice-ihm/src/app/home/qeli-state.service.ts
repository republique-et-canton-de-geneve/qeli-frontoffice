import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QeliStateSchema } from '../service/question/qeli-state.model';
import { map } from 'rxjs/operators';

/**
 * Un service qui permet de mettre à jour le statut du formulaire en gérant la navigation.
 */
@Injectable({
  providedIn: 'root'
})
export class QeliStateService {

  constructor(private router: Router) {
  }

  /**
   * Met à jour le statut du formulaire.
   *
   * @param state le nouveau srtatut.
   * @param route la page actuel.
   */
  updateState(state: QeliStateSchema, route: ActivatedRoute) {
    // TODO LZ compression and recalculation of all refuses for the deep linking
    this.router.navigate([], {
      queryParams: {data: QeliStateService.encryptState(state)},
      relativeTo: route
    });
  }

  onStateChanged(route: ActivatedRoute) {
    return route.queryParams.pipe(
      map(params => params && params['data'] ? QeliStateService.decryptState(params['data']) : null)
    );
  }


  private static encryptState(data: any) {
    return btoa(JSON.stringify(data));
  }

  private static decryptState(encryptedData: string): QeliStateSchema {
    return JSON.parse(atob(encryptedData));
  }
}
