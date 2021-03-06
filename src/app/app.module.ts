import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
// import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { DynamicFormModule } from './dynamic-form/dynamic-form.module';
import { AppComponent } from './app.component';
import { LogHttpIntercepter } from './log-http-intercepter';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { MyLoaderComponent } from './my-loader/my-loader.component';
// import { DynamicAppComponent } from './dynamic-app/dynamic-app.component';
// import { DynamicPageComponent } from './dynamic-page/dynamic-page.component';
// import { CalendarModule } from 'primeng/calendar';
// import { MenubarRtlModule } from './menubar-rtl/menubar-rtl.component';
// import { MenubarModule } from 'primeng/components/menubar/menubar';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    // HttpModule,
    DynamicFormModule,
    HttpClientModule,
    FormsModule,
    // MenubarModule,
    // MenubarRtlModule
  ],
  declarations: [AppComponent], //, DynamicAppComponent, DynamicPageComponent
  bootstrap: [AppComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LogHttpIntercepter,
      multi: true
    }
  ]
})
export class AppModule {
  constructor() {}
}
