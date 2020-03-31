import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { BowserService } from '../bowser/bowser.service';

@Directive({
  selector: '[focusOnInit]'
})
export class FocusOnInitDirective implements OnInit {

  @Input() focusOnInit: boolean = true;

  constructor(private el: ElementRef,
              private bowserService: BowserService) {

  }

  ngOnInit(): void {
    if (!this.bowserService.mobile && this.focusOnInit) {
      this.el.nativeElement.focus();
    }
  }
}
