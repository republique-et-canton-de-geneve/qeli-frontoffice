import { NgModule } from '@angular/core';
import { DateInputComponent } from './date-input/date-input.component';
import { InputContainerComponent } from './input-container/input-container.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';

@NgModule({
  imports: [
    CoreModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    InputContainerComponent,
    DateInputComponent
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    InputContainerComponent,
    DateInputComponent
  ],
  entryComponents: [
    InputContainerComponent,
    DateInputComponent
  ]
})
export class GeFormsModule {
}
