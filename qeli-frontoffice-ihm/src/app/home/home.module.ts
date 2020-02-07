import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { CoreModule } from '../core/core.module';
import { FormResultComponent } from './form-result/form-result.component';
import { ResultBlockComponent } from './form-result/result-block/result-block.component';
import { NavigationComponent } from './navigation/navigation.component';
import { BootstrapModule } from '../bootstrap/bootstrap.module';

@NgModule({
  imports: [
    CoreModule,
    BootstrapModule
  ],
  declarations: [
    HomeComponent,
    FormResultComponent,
    ResultBlockComponent,
    NavigationComponent
  ],
  entryComponents: [
    FormResultComponent,
    ResultBlockComponent,
    NavigationComponent
  ]
})
export class HomeModule {
}
