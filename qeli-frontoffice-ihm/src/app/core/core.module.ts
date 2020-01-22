import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component'
import { DynamicQuestionComponent } from './dynamic-question/dynamic-question.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuestionDirective } from './question/question.directive';
import { CheckboxGroupQuestionComponent } from './question/checkbox-group-question/checkbox-group-question.component';
import { DateQuestionComponent } from './question/date-question/date-question.component';
import { DropdownQuestionComponent } from './question/dropdown-question/dropdown-question.component';
import { TextQuestionComponent } from './question/text-question/text-question.component';
import { NationaliteQuestionComponent } from './question/nationalite-question/nationalite-question.component';
import { RadioQuestionComponent } from './question/radio-question/radio-question.component';
import { FocusOnInitDirective } from './common/init.directive';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/');
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
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
    DynamicFormComponent,
    HttpClientModule,
    TranslateModule,
  ],
  declarations: [
    QuestionDirective,
    FocusOnInitDirective,
    CheckboxGroupQuestionComponent,
    DateQuestionComponent,
    DropdownQuestionComponent,
    DynamicFormComponent,
    DynamicQuestionComponent,
    NationaliteQuestionComponent,
    RadioQuestionComponent,
    TextQuestionComponent
  ],
  entryComponents: [
    CheckboxGroupQuestionComponent,
    DateQuestionComponent,
    DropdownQuestionComponent,
    DynamicFormComponent,
    DynamicQuestionComponent,
    NationaliteQuestionComponent,
    RadioQuestionComponent,
    TextQuestionComponent
  ]
})
export class CoreModule {
}
