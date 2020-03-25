import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DeepLinkService } from './deep-link.service';
import { ActivatedRoute } from '@angular/router';
import { TrackingService } from '../service/tracking.service';

@Component({
  selector: 'app-deep-link',
  templateUrl: './deep-link.component.html',
  styleUrls: ['./deep-link.component.scss']
})
export class DeepLinkComponent implements OnInit {
  id: number;
  isCopied: boolean = false;
  showCopyPanel: boolean = false;

  @ViewChild('deepLinkInput', {static: false}) deepLinkInput: ElementRef;

  constructor(private deepLinkService: DeepLinkService,
              private route: ActivatedRoute,
              private trackingService: TrackingService) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(() => {
      this.showCopyPanel = false;
      this.isCopied = false;
    });
  }

  copyDeepLink() {
    this.isCopied = true;
    this.trackingService.trackDeepLink();
    this.deepLinkInput.nativeElement.select();
    document.execCommand('copy');
    this.deepLinkInput.nativeElement.setSelectionRange(0, 0);
    setTimeout(() => this.isCopied = false, 5000);
  }

  get deepLink() {
    return this.deepLinkService.getCurrentDeepLink();
  }

}
