import { Component, EventEmitter, Input, Output } from '@angular/core';
import { QeliState } from '../../service/question/qeli-state.model';

@Component({
  selector: 'app-navigation-controls',
  templateUrl: './navigation-controls.component.html',
  styleUrls: ['./navigation-controls.component.scss']
})
export class NavigationControlsComponent {


  @Input() disablePrevious: boolean;
  @Input() disableNext: boolean;

  @Output() onNextClicked: EventEmitter<QeliState> = new EventEmitter();
  @Output() onPreviousClicked: EventEmitter<QeliState> = new EventEmitter();

  nextQuestion() {
    this.onNextClicked.emit();
  }

  previousQuestion() {
    this.onPreviousClicked.emit();
  }
}
