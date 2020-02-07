import { NgModule } from '@angular/core';
import { NgbCollapseModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  exports: [
    NgbDatepickerModule,
    NgbCollapseModule
  ]
})
export class BootstrapModule {

}
