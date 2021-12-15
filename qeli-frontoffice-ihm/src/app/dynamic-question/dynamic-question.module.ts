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
import { GeFormsModule } from '../ge-forms/ge-forms.module';
import { CheckboxGroupQuestionComponent } from './checkbox-group-question/checkbox-group-question.component';
import { DateQuestionComponent } from './date-question/date-question.component';
import { DropdownQuestionComponent } from './dropdown-question/dropdown-question.component';
import { DynamicQuestionComponent } from './dynamic-question.component';
import { NationaliteQuestionComponent } from './nationalite-question/nationalite-question.component';
import { NumberQuestionComponent } from './number-question/number-question.component';
import { QuestionDirective } from './model/question.directive';
import { RadioQuestionComponent } from './radio-question/radio-question.component';
import { TauxQuestionComponent } from './taux-question/taux-question.component';
import { TextQuestionComponent } from './text-question/text-question.component';
import { CoreModule } from '../core/core.module';
import { DeepLinkModule } from '../deep-link/deep-link.module';
import { CompositeQuestionComponent } from './composite-question/composite-question.component';

@NgModule({
  imports: [
    CoreModule,
    GeFormsModule,
    DeepLinkModule
  ],
  exports: [
    DynamicQuestionComponent
  ],
  declarations: [
    CheckboxGroupQuestionComponent,
    CompositeQuestionComponent,
    DateQuestionComponent,
    DropdownQuestionComponent,
    DynamicQuestionComponent,
    NationaliteQuestionComponent,
    NumberQuestionComponent,
    QuestionDirective,
    RadioQuestionComponent,
    TauxQuestionComponent,
    TextQuestionComponent
  ],
  entryComponents: [
    CheckboxGroupQuestionComponent,
    CompositeQuestionComponent,
    DateQuestionComponent,
    DropdownQuestionComponent,
    DynamicQuestionComponent,
    NationaliteQuestionComponent,
    NumberQuestionComponent,
    RadioQuestionComponent,
    TauxQuestionComponent,
    TextQuestionComponent
  ]
})
export class DynamicQuestionModule {
}
