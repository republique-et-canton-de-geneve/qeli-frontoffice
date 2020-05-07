import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-validation',
  templateUrl: './modal-validation.component.html',
  styleUrls: ['./modal-validation.component.scss']
})
export class ModalValidationComponent {

  @Input()
  display;

  @Output()
  onAccepte = new EventEmitter();

  @Output()
  onRefuse = new EventEmitter();

  constructor() {
  }

  onRefuseHandled() {
    this.display = "none";
    this.onRefuse.emit();
  }

  onAcceptHandled() {
    this.display = "none";
    this.onAccepte.emit();
  }

}
