import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FocusOnInitDirective } from './common/focus-on-init.directive';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { TrackAfterViewInitDirective } from './common/track-after-view-init.directive';
import { BootstrapModule } from '../bootstrap/bootstrap.module';

export const ngxMaskModuleOptions: Partial<IConfig> | (() => Partial<IConfig>) = {};

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/');
}

@NgModule({
  imports: [
    CommonModule,
    NgxMaskModule.forRoot(ngxMaskModuleOptions),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports: [
    CommonModule,
    BootstrapModule,
    HttpClientModule,
    NgxMaskModule,
    TranslateModule,
    FocusOnInitDirective,
    TrackAfterViewInitDirective
  ],
  declarations: [
    FocusOnInitDirective,
    TrackAfterViewInitDirective
  ]
})
export class CoreModule {
}
