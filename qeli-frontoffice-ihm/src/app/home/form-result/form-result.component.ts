import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Prestation } from '../../service/configuration/prestation.model';
import { EligibiliteGroup, EligibiliteRefusee } from '../../service/question/eligibilite.model';
import { QeliState } from '../../service/question/qeli-state.model';
import { TranslateService } from '@ngx-translate/core';
import { RestService } from '../../service/rest.service';
import { FlattenAnswerVisitorFactory } from '../../core/common/flatten-answer.visitor';

@Component({
  selector: 'app-form-result',
  templateUrl: './form-result.component.html',
  styleUrls: ['./form-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormResultComponent {
  eligibiles: Prestation[];
  dejaPercues: Prestation[];
  refusees: EligibiliteRefusee[];
  responses: any;

  constructor(private translateService: TranslateService, private flatterAnswerVisitorFactory: FlattenAnswerVisitorFactory, private restService: RestService) {

  }

  @Input()
  set qeliState(state: QeliState) {
    this.dejaPercues = state.eligibilitesRefusees.filter(e => e.dejaPercue).map(e => e.eligibilite.prestation);
    this.refusees = state.eligibilitesRefusees.filter(e => !e.dejaPercue);
    this.eligibiles = [...new Set(
      state.eligibilites.filter(eligibilite =>
        !new EligibiliteGroup(state.eligibilitesRefusees.map(refus => refus.eligibilite)).includes(eligibilite)
      ).map(eligiilite => eligiilite.prestation))
    ];
  }

  generatePDF(){
    var flattenData: FlattenData;
    flattenData = new FlattenData(new Map(this.questions.map(question => [question.key, question.accept(this.flatterAnswerVisitorFactory.create(this.reponses))[0]])),
      this.prestationEligible, this.prestationDejaPercues, this.prestationsRefusees);

    console.log(flattenData);

    this.restService.generatePDF(flattenData).subscribe(res => {

      let blob: any = new Blob([(res)], { type: 'application/pdf' });
      let blobUrl: string = window.URL.createObjectURL(blob);
      window.open(blobUrl);
    }, err => {
      console.log('error : ', err);
    });
  }

}
