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
