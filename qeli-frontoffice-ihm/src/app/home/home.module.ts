import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { CoreModule } from '../core/core.module';
import { FormResultComponent } from './form-result/form-result.component';
import { ResultBlockComponent } from './form-result/result-block/result-block.component';

@NgModule({
  imports: [
    CoreModule
  ],
  declarations: [
    HomeComponent,
    FormResultComponent,
    ResultBlockComponent
  ],
  entryComponents: [
    FormResultComponent,
    ResultBlockComponent
  ]
})
export class HomeModule {
}
