import { AfterViewInit, Directive, Input } from '@angular/core';
import { TrackingService } from '../../service/tracking.service';

@Directive({
  selector: '[trackQuestionIdentifier]'
})
export class TrackAfterViewInitDirective implements AfterViewInit {

  @Input() trackQuestionIdentifier: string;

  constructor(private trackingService: TrackingService) {

  }

  ngAfterViewInit(): void {
    if (this.trackQuestionIdentifier) {
      this.trackingService.trackQuestion(this.trackQuestionIdentifier);
    }
  }
}
