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
    HttpClientModule,
    TranslateModule,
    DynamicFormComponent
  ],
  declarations: [
    DynamicFormComponent,
    DynamicQuestionComponent,
    QuestionDirective,
    CheckboxGroupQuestionComponent,
    DateQuestionComponent,
    DropdownQuestionComponent,
    TextQuestionComponent
  ],
  entryComponents: [
    DynamicFormComponent,
    DynamicQuestionComponent,
    CheckboxGroupQuestionComponent,
    DateQuestionComponent,
    DropdownQuestionComponent,
    TextQuestionComponent
  ]
})
export class CoreModule {
}
