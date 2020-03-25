import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { CoreModule } from '../core/core.module';
import { FormResultComponent } from './form-result/form-result.component';
import { ResultBlockComponent } from './form-result/result-block/result-block.component';
import { NavigationComponent } from './navigation/navigation.component';
import { FormatAnswerVisitorFactory } from './navigation/format-answer.visitor';
import { FormSetupComponent } from './form-setup/form-setup.component';
import { GeFormsModule } from '../ge-forms/ge-forms.module';
import { DynamicFormModule } from '../dynamic-form/dynamic-form.module';
import { DeepLinkModule } from '../deep-link/deep-link.module';

@NgModule({
  imports: [
    CoreModule,
    GeFormsModule,
    DeepLinkModule,
    DynamicFormModule
  ],
  declarations: [
    HomeComponent,
    FormResultComponent,
    ResultBlockComponent,
    NavigationComponent,
    FormSetupComponent
  ],
  entryComponents: [
    FormResultComponent,
    ResultBlockComponent,
    NavigationComponent
  ],
  providers: [
    FormatAnswerVisitorFactory
  ]
})
export class HomeModule {
}
