/*
 * qeli-frontoffice
 *
 * Copyright (C) 2019-2021 Republique et canton de Geneve
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
