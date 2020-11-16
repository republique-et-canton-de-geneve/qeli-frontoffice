import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TrackingService } from '../service/tracking/tracking.service';

@Component({
  selector: 'app-deep-link',
  templateUrl: './deep-link.component.html',
  styleUrls: ['./deep-link.component.scss']
})
export class DeepLinkComponent implements OnInit {
  id: number;
  isCopied = false;
  showCopyPanel = false;

  @ViewChild('deepLinkInput', {static: false}) deepLinkInput: ElementRef;

  constructor(private trackingService: TrackingService) {
  }

  ngOnInit() {
    this.showCopyPanel = false;
    this.isCopied = false;
  }

  copy() {
    this.isCopied = true;
    // TODO this.trackingService.trackDeepLink();
    this.deepLinkInput.nativeElement.select();
    document.execCommand('copy');
    this.deepLinkInput.nativeElement.setSelectionRange(0, 0);
    setTimeout(() => this.isCopied = false, 5000);
  }

  get currentUrl() {
    return location.href;
  }
}
