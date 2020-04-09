import { NgModule } from '@angular/core';
import { DeepLinkComponent } from './deep-link.component';
import { CoreModule } from '../core/core.module';

@NgModule({
  imports: [
    CoreModule
  ],
  declarations: [
    DeepLinkComponent
  ],
  exports: [
    DeepLinkComponent
  ],
  entryComponents: [
    DeepLinkComponent
  ]
})
export class DeepLinkModule {
}
