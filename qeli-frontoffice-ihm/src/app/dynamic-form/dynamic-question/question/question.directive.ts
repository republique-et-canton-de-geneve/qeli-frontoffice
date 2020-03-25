import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[app-question-host]',
})
export class QuestionDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
