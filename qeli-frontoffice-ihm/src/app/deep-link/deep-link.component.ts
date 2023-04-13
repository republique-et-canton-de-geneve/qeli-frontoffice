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

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TrackingService } from '../service/tracking/tracking.service';
import { DeepLinkService } from './deep-link.service';

@Component({
  selector: 'app-deep-link',
  templateUrl: './deep-link.component.html',
  styleUrls: ['./deep-link.component.scss']
})
export class DeepLinkComponent implements OnInit {
  id: number;
  isCopied = false;
  showCopyPanel = false;

  @ViewChild('deepLinkInput') deepLinkInput: ElementRef;

  constructor(private trackingService: TrackingService,
              private deepLinkService: DeepLinkService) {
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

  get deepLink() {
    return this.deepLinkService.deepLink;
  }
}
