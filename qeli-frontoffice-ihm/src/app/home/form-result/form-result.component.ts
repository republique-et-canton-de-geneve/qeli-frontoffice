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

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { QeliStateMachine } from '../../service/question/qeli-state.model';
import { TranslateService } from '@ngx-translate/core';
import { FormData } from '../../dynamic-question/model/question.model';
import { FormResult } from '../../service/question/result.model';
import { FormResultService } from '../../service/question/form-result.service';
import { Demandeur } from '../../service/configuration/demandeur.model';

@Component({
  selector: 'app-form-result',
  templateUrl: './form-result.component.html',
  styleUrls: ['./form-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormResultComponent {
  formData: FormData;
  formResult: FormResult;
  demandeur: Demandeur;

  @Input() canSavePDF: boolean = true;
  @Input() disableDeepLink: boolean = false;

  constructor(private translateService: TranslateService,
              private formResultService: FormResultService) {

  }

  @Input()
  set qeliStateMachine(qeliStateMachine: QeliStateMachine) {
    const state = qeliStateMachine.state;
    this.formResult = this.formResultService.toFormResult(qeliStateMachine);
    this.formData = state.formData;
    this.demandeur = state.demandeur;
  }
}
