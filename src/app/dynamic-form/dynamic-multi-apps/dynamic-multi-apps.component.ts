import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ViewChildren, AfterViewInit, QueryList } from '@angular/core';
import { QuestionService } from 'app/dynamic-form/question.service';
import { TabView } from 'primeng/tabview';
import { DynamicFormComponent } from '../dynamic-form.component';
import { DynamicGridBComponent } from '../dynamic-grid-b.component';
import { DynamicGridEditableComponent } from '../dynamic-grid-editable.component';

// The animObj is declared in assets/animatedScrollTo.js. 
// watch https://www.thepolyglotdeveloper.com/2016/01/include-external-javascript-libraries-in-an-angular-2-typescript-project/
declare var animObj: any;

@Component({
  selector: 'app-dynamic-multi-apps',
  templateUrl: './dynamic-multi-apps.component.html',
  styleUrls: ['./dynamic-multi-apps.component.css'],
  providers: [QuestionService]
})
export class DynamicMultiAppsComponent implements OnInit, AfterViewInit {

  @ViewChild('tabs') tabs: TabView

  // @ViewChildren(DynamicFormComponent) forms: QueryList<DynamicFormComponent>;
  // @ViewChildren(DynamicGridBComponent) grids: QueryList<DynamicGridBComponent>;
  // @ViewChildren(DynamicGridEditableComponent) editableGrids: QueryList<DynamicGridEditableComponent>;
  private forms: QueryList<DynamicFormComponent>;
  @ViewChildren(DynamicFormComponent) set contentA(content: QueryList<DynamicFormComponent>) {
     this.forms = content;
     this.addToApps(content);
  }
  private grids: QueryList<DynamicGridBComponent>;
  @ViewChildren(DynamicGridBComponent) set contentB(content: QueryList<DynamicGridBComponent>) {
     this.grids = content;
     this.addToApps(content);
  }
  private editableGrids: QueryList<DynamicGridEditableComponent>;
  @ViewChildren(DynamicGridEditableComponent) set contentC(content: QueryList<DynamicGridEditableComponent>) {
     this.editableGrids = content;
     this.addToApps(content);
  }

  @Input() key: string;
  @Input() params: any = null;

  @Output() onFormSaved  = new EventEmitter<any>();

  data: any[];
  selectedTab: string;

  anim = new animObj();

  useScroll = true;

  field = { 'pm': '', 'line': 0, 'field': '' };

  appsObj = {};

  constructor(private service: QuestionService) { }

  ngOnInit() {
    this.initApps();
  }

  ngAfterViewInit() {
    const t = 4;
  }

  initApps(): void {
    this.service.getApps(this.key, this.params).then(response => {
      this.data  = response;
      this.selectedTab = response[0].type + '-' + response[0].key;
    });
  }

  formSaved(formData: any) {
    // alert('Form ' + formKey + ' saved: ' + JSON.stringify(values));
    this.onFormSaved.emit({ formKey: formData.formKey, values: formData.values });
  }

  selectTab(event: any, tabId: string) {
    const parentOffset = (document.querySelector('#tabs-content') as HTMLElement).offsetTop;
    const tabOffset = (document.querySelector('#' + tabId) as HTMLElement).offsetTop;
    
    this.anim.animatedScrollTo(document.querySelector('#tabs-content'), tabOffset - parentOffset, 500);
    
    this.selectedTab = tabId;
  }

  useScrollChanged(value) {
    this.useScroll = value;
  }

  saveAll(event) {
    const r = 3;
  }

  updateField(value: any) {
    const comp = this.appsObj[this.field.pm];
    comp.setValue(this.field, value);
    // if (comp instanceof DynamicFormComponent) {
    //   comp.form.controls[this.field.field].setValue(value);
    // }
    // else if (comp instanceof DynamicGridBComponent) {
    //   comp.data[this.field.line][this.field.field] = value;
    // }
    // else if (comp instanceof DynamicGridEditableComponent) {
    //   const col = comp.grid.columns.filter((c) => c.id === this.field.field);
    //   //if (col['type'] === '') {}
    //   // comp.data[this.field.line][this.field.field].value = value;
    //   // comp.data[this.field.line][this.field.field].valueHolder = value;
    //   const currValue = Object.assign({}, comp.data[this.field.line][this.field.field]);
    //   currValue.value = value;
    //   currValue.valueHolder = value;
    //   comp.data[this.field.line][this.field.field] = currValue;
    // }
  }

  addToApps(apps: QueryList<any>) {
    if (apps.length > 0) {
      apps.toArray().forEach(a => {
        const key = a.formKey || a.gridKey;
        this.appsObj[key] = a;
      });
    }
  }

}
