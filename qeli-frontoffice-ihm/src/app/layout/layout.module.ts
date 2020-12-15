import { NgModule } from '@angular/core';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { CoreModule } from '../core/core.module';

@NgModule({
  imports: [
    CoreModule
  ],
  exports: [
    FooterComponent,
    HeaderComponent
  ],
  declarations: [
    FooterComponent,
    HeaderComponent
  ],
  entryComponents: [],
  providers: []
})
export class LayoutModule {
}
