import { NgModule } from '@angular/core';

import { HomeComponent } from './home.component';
import { CoreModule } from '../core/core.module';

@NgModule({
  imports: [CoreModule],
  declarations: [HomeComponent]
})
export class HomeModule {
}
