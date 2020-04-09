import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgModule } from '@angular/core';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FocusOnInitDirective } from './element/focus-on-init.directive';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { BootstrapModule } from '../bootstrap/bootstrap.module';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';

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
      },
      compiler: {
        provide: TranslateCompiler,
        useClass: TranslateMessageFormatCompiler
      }
    })
  ],
  exports: [
    CommonModule,
    BootstrapModule,
    HttpClientModule,
    NgxMaskModule,
    TranslateModule,
    FocusOnInitDirective
  ],
  declarations: [
    FocusOnInitDirective
  ]
})
export class CoreModule {
}
