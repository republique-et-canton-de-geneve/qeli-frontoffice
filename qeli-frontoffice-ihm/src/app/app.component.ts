import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TrackingService } from './services/tracking.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private translate: TranslateService,
              private trackingService: TrackingService) {
    this.trackingService.initMatomo();
  }

  ngOnInit(): void {
    this.translate.addLangs(["fr"]);
    this.translate.setDefaultLang("fr");
    this.translate.use("fr");
  }
}
