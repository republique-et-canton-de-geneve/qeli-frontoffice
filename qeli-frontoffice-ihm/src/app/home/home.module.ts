import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { CoreModule } from '../core/core.module';
import { FormResultComponent } from './form-result/form-result.component';

@NgModule({
  imports: [
    CoreModule
  ],
  declarations: [
    HomeComponent,
    FormResultComponent
  ],
  entryComponents: [
    FormResultComponent
  ]
})
export class HomeModule {
}
