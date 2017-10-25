import { BrowserModule }                from '@angular/platform-browser';
import { ReactiveFormsModule }          from '@angular/forms';
import { NgModule }                     from '@angular/core';
import { HttpModule }    from '@angular/http';

import { AppComponent }                 from './app.component';
import { DynamicFormComponent }         from './dynamic-form.component';
import { DynamicFormQuestionComponent } from './dynamic-form-question.component';
import { ValidateOnBlurDirective } from './validate-on-blur.directive';

@NgModule({
  imports: [ 
  BrowserModule, 
  ReactiveFormsModule, 
  HttpModule ],
  declarations: [ AppComponent, DynamicFormComponent, DynamicFormQuestionComponent, ValidateOnBlurDirective ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
  constructor() {
  }
}
