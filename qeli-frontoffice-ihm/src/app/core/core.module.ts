import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FocusOnInitDirective } from './element/focus-on-init.directive';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { BootstrapModule } from '../bootstrap/bootstrap.module';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { from, Observable } from 'rxjs';

export const ngxMaskModuleOptions: Partial<IConfig> | (() => Partial<IConfig>) = {};

export class WebpackTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return from(import(`../../assets/i18n/${lang}.json`));
  }
}

@NgModule({
  imports: [
    CommonModule,
    NgxMaskModule.forRoot(ngxMaskModuleOptions),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: WebpackTranslateLoader
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
