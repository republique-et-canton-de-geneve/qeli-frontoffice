import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { CoreModule } from '../core/core.module';
import { FormResultComponent } from './form-result/form-result.component';
import { ResultBlockComponent } from './form-result/result-block/result-block.component';
import { NavigationMenuComponent } from './navigation-menu/navigation-menu.component';
import { FormSetupComponent } from './form-setup/form-setup.component';
import { ModalValidationComponent } from './modal-validation/modal-validation.component';
import { GeFormsModule } from '../ge-forms/ge-forms.module';
import { DynamicQuestionModule } from '../dynamic-question/dynamic-question.module';
import { DeepLinkModule } from '../deep-link/deep-link.module';
import { NavigationControlsComponent } from './navigation-controls/navigation-controls.component';
import { QeliFormComponent } from './qeli-form/qeli-form.component';

@NgModule({
  imports: [
    CoreModule,
    GeFormsModule,
    DeepLinkModule,
    DynamicQuestionModule
  ],
  declarations: [
    HomeComponent,
    FormResultComponent,
    ResultBlockComponent,
    NavigationMenuComponent,
    FormSetupComponent,
    ModalValidationComponent,
    NavigationControlsComponent,
    QeliFormComponent
  ],
  entryComponents: [
    FormResultComponent,
    ResultBlockComponent,
    NavigationMenuComponent,
    QeliFormComponent
  ]
})
export class HomeModule {
}
