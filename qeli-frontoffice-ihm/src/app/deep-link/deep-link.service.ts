import { map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QeliStateSchema } from '../service/question/qeli-state.model';
import * as LZUTF8 from 'lzutf8';


/**
 * Un service qui permet de mettre à jour le statut du formulaire en gérant la navigation.
 */
@Injectable({
  providedIn: 'root'
})
export class DeepLinkService {
  constructor(private router: Router) {
  }

  /**
   * Met à jour le statut du formulaire.
   *
   * @param state le nouveau srtatut.
   * @param route la page actuel.
   */
  updateState(state: QeliStateSchema, route: ActivatedRoute) {
    this.router.navigate([], {
      queryParams: {
        data: this.compressState(state)
      },
      relativeTo: route
    });
  }

  onStateUpdated(route: ActivatedRoute) {
    return route.queryParams.pipe(
      map(params => params && params['data'] ? this.decompressState(params['data']) : null)
    );
  }

  private compressState(state: QeliStateSchema) {
    const result = LZUTF8.compress(JSON.stringify({
      formData: state.formData,
      demandeur: state.demandeur,
      currentQuestionIndex: state.currentQuestionIndex
    }), {outputEncoding: 'Base64'});
    return result;
  }

  private decompressState(encryptedData: string): QeliStateSchema {
    const result = JSON.parse(LZUTF8.decompress(encryptedData, {inputEncoding: 'Base64'}));
    return result;
  }

  get deepLink() {
    return location.href;
  }
}
