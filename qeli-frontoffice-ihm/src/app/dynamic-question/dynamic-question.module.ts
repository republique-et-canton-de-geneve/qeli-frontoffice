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
import { NumberGroupQuestionComponent } from './number-group-question/number-group-question.component';
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
    TextQuestionComponent,
    NumberGroupQuestionComponent
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
    TextQuestionComponent,
    NumberGroupQuestionComponent
  ]
})
export class DynamicQuestionModule {
}
