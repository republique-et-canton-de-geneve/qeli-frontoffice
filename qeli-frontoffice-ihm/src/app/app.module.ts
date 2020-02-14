import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeFrCH from '@angular/common/locales/fr-CH';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { LayoutModule } from './layout/layout.module';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { HomeModule } from './home/home.module';
import { MatomoModule } from 'ngx-matomo';

registerLocaleData(localeFrCH);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CoreModule,
    LayoutModule,
    HomeModule,
    RouterModule,
    MatomoModule
  ],
  providers: [
    {provide: LOCALE_ID, useValue: "fr-CH"}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
