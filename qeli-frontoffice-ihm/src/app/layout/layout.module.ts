import { NgModule } from '@angular/core';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { CoreModule } from '../core/core.module';

@NgModule({
  imports: [
    CoreModule
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    ToolbarComponent
  ],
  declarations: [
    FooterComponent,
    HeaderComponent,
    ToolbarComponent
  ],
  entryComponents: [],
  providers: []
})
export class LayoutModule {
}
