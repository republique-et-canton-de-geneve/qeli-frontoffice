import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[focusOnInit]',
})
export class FocusOnInitDirective implements OnInit {

  @Input() focusOnInit: boolean = true;

  constructor(private el: ElementRef) {

  }

  ngOnInit(): void {
    if (this.focusOnInit) {
      this.el.nativeElement.focus();
    }
  }
}
