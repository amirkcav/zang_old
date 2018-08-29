import { Component, OnInit, Input, QueryList, ViewChildren } from '@angular/core';
import { Page } from './dynamic-page.model';
import { DynamicGridEditableComponent } from '../dynamic-form/dynamic-grid-editable.component';
import { DynamicGridBComponent } from '../dynamic-form/dynamic-grid-b.component';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';

@Component({
  selector: 'dynamic-page',
  templateUrl: './dynamic-page.component.html',
  styleUrls: ['./dynamic-page.component.css']
})
export class DynamicPageComponent implements OnInit {

  @Input() data: Page;

  private forms: QueryList<DynamicFormComponent>;
  @ViewChildren(DynamicFormComponent) set contentA(content: QueryList<DynamicFormComponent>) {
     this.forms = content;
     this.addToDataObj(content);
  }
  private grids: QueryList<DynamicGridBComponent>;
  @ViewChildren(DynamicGridBComponent) set contentB(content: QueryList<DynamicGridBComponent>) {
     this.grids = content;
     this.addToDataObj(content);
  }
  private editableGrids: QueryList<DynamicGridEditableComponent>;
  @ViewChildren(DynamicGridEditableComponent) set contentC(content: QueryList<DynamicGridEditableComponent>) {
     this.editableGrids = content;
     this.addToDataObj(content);
  }

  constructor() { }

  ngOnInit() {
    
  }

  getWidthClass(width) {
    let widthClass = 'ui-lg-';
    if (!width) {
      widthClass += 12;
    }
    else if (width % 33 === 0) {
      widthClass += 4 * (width / 33);
    }
    else {
      widthClass += 12 * width / 100;
    }
    return widthClass;
  }

  addToDataObj(apps: QueryList<any>) {
    if (apps.length > 0) {
      apps.toArray().forEach(a => {
        const key = a.formKey || a.gridKey;
        this.data.components[key] = a;
      });
    }
  }

}
