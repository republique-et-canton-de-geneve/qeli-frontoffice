import { NgModule } from '@angular/core';
import { DateInputComponent } from './date-input/date-input.component';
import { InputContainerComponent } from './input-container/input-container.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { HelpBlockComponent } from './help-block/help-block.component';

@NgModule({
  imports: [
    CoreModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    InputContainerComponent,
    DateInputComponent,
    HelpBlockComponent
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    InputContainerComponent,
    HelpBlockComponent,
    DateInputComponent
  ],
  entryComponents: [
    InputContainerComponent,
    DateInputComponent,
    HelpBlockComponent
  ]
})
export class GeFormsModule {
}
