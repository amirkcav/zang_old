import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule }                from '@angular/platform-browser';
import { ReactiveFormsModule }          from '@angular/forms';
import { HttpModule }    from '@angular/http';

import { DynamicFormComponent }         from './dynamic-form.component';
import { DynamicFormQuestionComponent } from './dynamic-form-question.component';
import { ValidateOnBlurDirective } from './validate-on-blur.directive';

@NgModule({
	imports: [ 
		CommonModule,
		BrowserModule, 
		ReactiveFormsModule, 
		HttpModule ],
	declarations: [ 
		DynamicFormComponent, 
		DynamicFormQuestionComponent, 
		ValidateOnBlurDirective ],
	exports: [ 
		DynamicFormComponent, 
		DynamicFormQuestionComponent, 
		ValidateOnBlurDirective ]
})

export class DynamicFormModule { }
