import { BrowserModule }                from '@angular/platform-browser';
import { ReactiveFormsModule }          from '@angular/forms';
import { NgModule }                     from '@angular/core';
import { HttpModule }    from '@angular/http';

import { DynamicFormModule }                 from './dynamic-form/dynamic-form.module';

import { AppComponent }                 from './app.component';

@NgModule({
  imports: [ 
  BrowserModule, 
  ReactiveFormsModule, 
  HttpModule,
  DynamicFormModule ],
//  declarations: [ AppComponent, DynamicFormComponent, DynamicFormQuestionComponent, ValidateOnBlurDirective ],
  declarations: [ AppComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
  constructor() {
  }
}
