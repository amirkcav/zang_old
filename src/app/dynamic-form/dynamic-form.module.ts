import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BusyModule } from 'angular2-busy';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { DynamicFormComponent } from './dynamic-form.component';
import { DynamicFormQuestionComponent } from './dynamic-form-question.component';
import { ValidateOnBlurDirective } from './validate-on-blur.directive';

import { DynamicGridComponent } from './dynamic-grid.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    BusyModule,
    BrowserAnimationsModule,
    NgxDatatableModule
  ],
  declarations: [
    DynamicFormComponent,
    DynamicFormQuestionComponent,
    ValidateOnBlurDirective,
    DynamicGridComponent
  ],
  exports: [
    DynamicFormComponent,
    DynamicFormQuestionComponent,
    ValidateOnBlurDirective,
    DynamicGridComponent
  ]
})
export class DynamicFormModule {}
