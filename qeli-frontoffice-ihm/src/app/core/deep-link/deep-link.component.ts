import { Component, OnInit } from '@angular/core';
import { DeepLinkService } from '../deep-link.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-deep-link',
  templateUrl: './deep-link.component.html',
  styleUrls: ['./deep-link.component.scss']
})
export class DeepLinkComponent implements OnInit {
  isCopied: boolean = false;
  showCopyPanel: boolean = false;
  copyButtonText: string;

  constructor(
    private deepLinkService: DeepLinkService,
    private route: ActivatedRoute,
    private translate: TranslateService
  ) {
  }

  ngOnInit() {
    this.translate.get('form.deepLink.copyButton').subscribe((text: string) => {
      this.copyButtonText = text
    });

    this.route.queryParams.subscribe(() => {
      this.showCopyPanel = false;
    });
  }

  copyDeepLink(linkInputElement) {
    this.translate.get('form.deepLink.copyButtonAlt').subscribe((text: string) => {
      this.copyButtonText = text
    });
    this.isCopied = true;
    linkInputElement.select();
    document.execCommand('copy');
    linkInputElement.setSelectionRange(0, 0);
    setTimeout(() => {
      this.translate.get('form.deepLink.copyButton').subscribe((text: string) => {
        this.copyButtonText = text
      });
      this.isCopied = false;
    }, 5000);
  }

  get deepLink() {
    return this.deepLinkService.getCurrentDeepLink();
  }

}
