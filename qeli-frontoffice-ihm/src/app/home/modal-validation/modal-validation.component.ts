import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-validation',
  templateUrl: './modal-validation.component.html',
  styleUrls: ['./modal-validation.component.scss']
})
export class ModalValidationComponent {

  @Output()
  onAccepte = new EventEmitter();

  @Output()
  onRefuse = new EventEmitter();

  constructor() {
  }

  onRefuseHandled() {
    this.onRefuse.emit();
  }

  onAcceptHandled() {
    this.onAccepte.emit();
  }

}
