import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ViewChildren, AfterViewInit, QueryList } from '@angular/core';
import { QuestionService } from '../dynamic-form/question.service';
import { TabView } from 'primeng/tabview';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import { DynamicGridBComponent } from '../dynamic-grid-b/dynamic-grid-b.component';
import { DynamicGridEditableComponent } from '../dynamic-grid-editable/dynamic-grid-editable.component';

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

  useScroll = true;

  field = { 'pm': '', 'line': 0, 'field': '' };

  appsObj = {};

  anim = new animObj();
  
  isFirstScroll = true;
  isUserScroll = true;
  prevScrollPosition = 0;
  currTabOffset = 0;

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
    this.isUserScroll = false;
    const _this = this;
    this.anim.animatedScrollTo(document.querySelector('#tabs-content'), tabOffset - parentOffset, 500, function() { _this.isUserScroll = true; });    
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
  }

  addToApps(apps: QueryList<any>) {
    if (apps.length > 0) {
      apps.toArray().forEach(a => {
        const key = a.formKey ? `form-${a.formKey}` : `grid-${a.gridKey}`;
        this.appsObj[key] = a;
      });
    }    
  }

  scroll(event) {
    // change the selected tab according to the scrolling position only when the user scrolls (not after tab click).
    if (this.isUserScroll) {
      if (this.isFirstScroll) {
        this.setPagesOffest();      
        this.isFirstScroll = false;
      }
      // { scrollDirection = true } is when scrolling down.
      const scrollDirection = this.prevScrollPosition < event.target.scrollTop;
      const tabsAbovePosition = [];
      Object.keys(this.appsObj).forEach((p) => {
        const obj = this.appsObj[p];
        // more exact calculation take into consideration the parent (scroll "owner") height.
        // when scrolling down, 100px before the page header reaches the top, when scrolling up 100px before the page header is shown.
        if (scrollDirection && obj['offset'] <  event.target.scrollTop + 100 && obj['offset'] > this.currTabOffset) {
          this.currTabOffset = obj['offset'];
          const tabId = obj.formKey ? `form-${obj.formKey}` : `grid-${obj.gridKey}`;          
          this.selectedTab = tabId;
        }
        // on scroll down, getting the tabs that are above the current scroll position.
        else if (!scrollDirection && obj['offset'] - obj['height'] <  event.target.scrollTop - 100) {
          tabsAbovePosition.push(obj);
        }
      });
      // getting the button most tab of the tabs above the current scroll position.
      if (!scrollDirection) {
        const tab = tabsAbovePosition.reduce((a, b) => a.offset > b.offset ? a : b);
        this.currTabOffset = tab.offset;
        const tabId = tab.formKey ? `form-${tab.formKey}` : `grid-${tab.gridKey}`;          
        this.selectedTab = tabId;
      }
    }
    this.prevScrollPosition = event.target.scrollTop;
  }

  setPagesOffest() {
    const parentOffset = (document.querySelector('#tabs-content') as HTMLElement).offsetTop;    
    Object.keys(this.appsObj).forEach((p) => {
      const obj = this.appsObj[p];
      const tabId = obj.formKey ? `form-${obj.formKey}` : `grid-${obj.gridKey}`;
      const elem = document.querySelector(`#${tabId}`) as HTMLElement;
      if (elem) {
        const offset = elem.offsetTop - parentOffset;
        const height = elem.offsetHeight;
        // getComputedStyle show style that is not declare in the element "style" attribute, but is from css files etc.
        const elemStyle = window.getComputedStyle(elem);
        obj['offset'] = offset;
        obj['height'] = height + +elemStyle['margin-bottom'].replace('px', '');
      }
    });  
  }

}
