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
import { FocusOnInitDirective } from './common/focus-on-init.directive';
import { DeepLinkComponent } from './deep-link/deep-link.component';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { BootstrapModule } from '../bootstrap/bootstrap.module';
import { EnfantsAChargeQuestionComponent } from './question/enfants-a-charge-question/enfants-a-charge-question.component';

export const ngxMaskModuleOptions: Partial<IConfig> | (() => Partial<IConfig>) = {};

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/');
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BootstrapModule,
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
    DynamicFormComponent,
    HttpClientModule,
    TranslateModule,
    DeepLinkComponent
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
    TextQuestionComponent,
    DeepLinkComponent,
    EnfantsAChargeQuestionComponent
  ],
  entryComponents: [
    CheckboxGroupQuestionComponent,
    DateQuestionComponent,
    DropdownQuestionComponent,
    DynamicFormComponent,
    DynamicQuestionComponent,
    NationaliteQuestionComponent,
    RadioQuestionComponent,
    TextQuestionComponent,
    EnfantsAChargeQuestionComponent
  ]
})
export class CoreModule {
}
