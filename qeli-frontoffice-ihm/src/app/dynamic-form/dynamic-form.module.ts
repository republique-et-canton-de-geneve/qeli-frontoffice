import { NgModule } from '@angular/core';
import { GeFormsModule } from '../ge-forms/ge-forms.module';
import { DynamicFormComponent } from './dynamic-form.component';
import { CheckboxGroupQuestionComponent } from './dynamic-question/question/checkbox-group-question/checkbox-group-question.component';
import { DateQuestionComponent } from './dynamic-question/question/date-question/date-question.component';
import { DropdownQuestionComponent } from './dynamic-question/question/dropdown-question/dropdown-question.component';
import { DynamicQuestionComponent } from './dynamic-question/dynamic-question.component';
import { NationaliteQuestionComponent } from './dynamic-question/question/nationalite-question/nationalite-question.component';
import { NumberQuestionComponent } from './dynamic-question/question/number-question/number-question.component';
import { QuestionDirective } from './dynamic-question/question/question.directive';
import { RadioQuestionComponent } from './dynamic-question/question/radio-question/radio-question.component';
import { TauxQuestionComponent } from './dynamic-question/question/taux-question/taux-question.component';
import { TextQuestionComponent } from './dynamic-question/question/text-question/text-question.component';
import { NumberGroupQuestionComponent } from './dynamic-question/question/number-group-question/number-group-question.component';
import { CoreModule } from '../core/core.module';
import { DeepLinkModule } from '../deep-link/deep-link.module';

@NgModule({
  imports: [
    CoreModule,
    GeFormsModule,
    DeepLinkModule
  ],
  exports: [
    DynamicFormComponent
  ],
  declarations: [
    CheckboxGroupQuestionComponent,
    DateQuestionComponent,
    DropdownQuestionComponent,
    DynamicFormComponent,
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
    DateQuestionComponent,
    DropdownQuestionComponent,
    DynamicFormComponent,
    DynamicQuestionComponent,
    NationaliteQuestionComponent,
    NumberQuestionComponent,
    RadioQuestionComponent,
    TauxQuestionComponent,
    TextQuestionComponent,
    NumberGroupQuestionComponent
  ]
})
export class DynamicFormModule {
}
