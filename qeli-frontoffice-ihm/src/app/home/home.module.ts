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

import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { CoreModule } from '../core/core.module';
import { FormResultComponent } from './form-result/form-result.component';
import { ResultBlockComponent } from './form-result/result-block/result-block.component';
import { NavigationMenuComponent } from './navigation-menu/navigation-menu.component';
import { FormSetupComponent } from './form-setup/form-setup.component';
import { ModalValidationComponent } from '../core/modal-validation/modal-validation.component';
import { GeFormsModule } from '../ge-forms/ge-forms.module';
import { DynamicQuestionModule } from '../dynamic-question/dynamic-question.module';
import { DeepLinkModule } from '../deep-link/deep-link.module';
import { NavigationControlsComponent } from './navigation-controls/navigation-controls.component';
import { QeliFormComponent } from './qeli-form/qeli-form.component';
import { BotDetectCaptchaModule } from 'angular-captcha';
import { PrintPdfComponent } from './form-result/print-pdf/print-pdf.component';

@NgModule({
  imports: [
    CoreModule,
    GeFormsModule,
    DeepLinkModule,
    DynamicQuestionModule,
    BotDetectCaptchaModule
  ],
  declarations: [
    HomeComponent,
    FormResultComponent,
    ResultBlockComponent,
    NavigationMenuComponent,
    FormSetupComponent,
    ModalValidationComponent,
    NavigationControlsComponent,
    QeliFormComponent,
    PrintPdfComponent
  ],
  entryComponents: [
    FormResultComponent,
    ResultBlockComponent,
    NavigationMenuComponent,
    QeliFormComponent,
    PrintPdfComponent
  ]
})
export class HomeModule {
}
