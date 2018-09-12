import { NgModule, ModuleWithProviders, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { BusyModule } from 'angular2-busy';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { DynamicFormComponent } from './dynamic-form.component';
import { DynamicFormQuestionComponent } from './dynamic-form-question.component';
import { ValidateOnBlurDirective } from './validate-on-blur.directive';

import { DynamicGridComponent } from 'app/dynamic-grid/dynamic-grid.component';
import { DynamicGridEditableComponent } from 'app/dynamic-grid-editable/dynamic-grid-editable.component'
import { DynamicMultiAppsComponent } from 'app/dynamic-multi-apps/dynamic-multi-apps.component';

import { AutoCompleteModule } from 'primeng/autocomplete'
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { InputMaskModule } from 'primeng/inputmask';
import { CheckboxModule } from 'primeng/checkbox';
import { TabViewModule } from 'primeng/tabview';

import { environment } from '../../environments/environment';
import { DynamicGridBComponent } from 'app/dynamic-grid-b/dynamic-grid-b.component';
// import { environment } from 'environments/environment';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    // HttpModule,
    HttpClientModule,
    BusyModule,
    BrowserAnimationsModule,
    NgxDatatableModule,
    AutoCompleteModule,
    CalendarModule,
    DropdownModule,
    TableModule,
    FileUploadModule,
    ConfirmDialogModule,
    DialogModule,
    InputMaskModule,
    CheckboxModule,
    TabViewModule
  ],
  declarations: [
    DynamicFormComponent,
    DynamicFormQuestionComponent,
    ValidateOnBlurDirective,
    DynamicGridComponent,
    DynamicGridBComponent,
    DynamicGridEditableComponent,
    DynamicMultiAppsComponent
  ],
  exports: [
    DynamicFormComponent,
    DynamicFormQuestionComponent,
    ValidateOnBlurDirective,
    DynamicGridComponent,
    DynamicGridBComponent,
    DynamicGridEditableComponent,
    DynamicMultiAppsComponent
  ]
})
export class DynamicFormModule {

  static forRoot(defaultPah: string): ModuleWithProviders {
    return {
      ngModule: DynamicFormModule,
      providers: [
        {provide: String, useValue: defaultPah }
      ]
    };
  }

  constructor(@Optional() defaultPath: string) {
    if (defaultPath) { 
      environment.dynamicFormBaseDevUrl = defaultPath;
    }
  }

}
