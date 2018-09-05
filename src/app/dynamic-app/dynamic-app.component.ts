import { Component, OnInit } from '@angular/core';
import { App } from './dynamic-app.model' 
import { QuestionService } from '../dynamic-form/question.service';
import { ConfirmationService } from 'primeng/api';
import { Field } from '../interfaces';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';

// The animObj is declared in assets/animatedScrollTo.js. 
// watch https://www.thepolyglotdeveloper.com/2016/01/include-external-javascript-libraries-in-an-angular-2-typescript-project/
declare var animObj: any;

@Component({
  selector: 'dynamic-app',
  templateUrl: './dynamic-app.component.html',
  styleUrls: ['./dynamic-app.component.css'],
  providers: [QuestionService, ConfirmationService]
})
export class DynamicAppComponent implements OnInit {
    
  data: App;
  dataHolder: App;

  selectedTab: string;
  anim = new animObj();

  isFirstScroll = true;
  isUserScroll = true;
  prevScrollPosition = 0;

  // because id of element can't start with a number.
  pageIdPrefix = 'page-';

  components: any;
  componentsKeys: string[];
  fieldsKeys: string[];
  field = new Field();
  isForm: boolean;
  lines: number;

  constructor(private service: QuestionService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.service.getApp('A', '').then((response) => {
      this.data = <App>response;
      this.dataHolder = JSON.parse(JSON.stringify(this.data));
      this.selectedTab = this.pageIdPrefix + this.data.pages[0].id;

      // this.changePage(this.data.pages[0].id);
    });
  }

  selectTab(event: any, tabId: string) {
    // code is needed (not using scrollIntoView()) so that the scrolling would be animated.
    const parentOffset = (document.querySelector('#tabs-content') as HTMLElement).offsetTop;
    const tabOffset = (document.querySelector('#' + tabId) as HTMLElement).offsetTop;
    this.isUserScroll = false;
    const _this = this;
    this.anim.animatedScrollTo(document.querySelector('#tabs-content'), tabOffset - parentOffset, 500, function() { _this.isUserScroll = true; });    
    this.selectedTab = tabId;
  }

  onSave() {

  }

  onCancel() {
    this.confirmationService.confirm({
      message: 'Are you sure? All unsaved changes would be lost.',
        accept: () => {
          this.data.pages.forEach((p) => {
            Object.keys(p.components).forEach(c => {
              p.components[c].cancelChanges();
            });
          });
        }
      });
  }

  scroll(event) {
    // change the selected tab according to the scrolling position only when the user scrolls (not after tab click).
    if (this.isUserScroll) {
      if (this.isFirstScroll) {
        this.setPagesOffest();      
        this.isFirstScroll = false;
      }
      // positive value is when scrolling down.
      const scrollDirection = this.prevScrollPosition < event.target.scrollTop;
      this.data.pages.forEach((p) => {
        // more exact calculation take into consideration the parent (scroll "owner") height.
        // when scrolling down, 100px before the page reaches the top, when scrolling down 100px before the page top is shown.
        if ((scrollDirection && p['offset'] <  event.target.scrollTop + 100) || 
            (!scrollDirection && p['offset'] - p['height'] <  event.target.scrollTop - 100)) {
          const tabId = this.pageIdPrefix + p.id;
          this.selectedTab = tabId;
        }
      });
    }
    this.prevScrollPosition = event.target.scrollTop;
  }

  setPagesOffest() {
    const parentOffset = (document.querySelector('#tabs-content') as HTMLElement).offsetTop;    
    this.data.pages.forEach((p) => {
      const elem = document.querySelector('#' + this.pageIdPrefix + p.id) as HTMLElement;
      if (elem) {
        const offset = elem.offsetTop - parentOffset;
        const height = elem.offsetHeight;
        // getComputedStyle show style that is not declare in the element "style" attribute, but is from css files etc.
        const elemStyle = window.getComputedStyle(elem);
        p['offset'] = offset;
        p['height'] = height + +elemStyle['margin-bottom'].replace('px', '');
      }
    });  
  }


  changePage(pageId) {
    const page = this.data.pages.find((p) => p.id.toString() === pageId.toString());
    this.components = page.components;
    this.componentsKeys = Object.keys(this.components);
    this.changePm(this.componentsKeys[0]);
  }

  changePm(pmId) {
    this.field.pm = pmId;
    const component = this.components[pmId];
    if (component instanceof DynamicFormComponent) {
      this.isForm = true;
      const fields = component.form.value;
      this.fieldsKeys = Object.keys(fields);
      this.changeField(this.fieldsKeys[0]);
    }
    else {
      this.isForm = false;
      this.lines = component.data.values.length;
      this.field.line = 0;
      const fields = component.data.headers.reduce((a, b) => { 
        if (b.id !== 'buttons') {
          a.push(b.id); 
        }
        return a;
      }, []);
      this.fieldsKeys = fields;
      this.field.field = fields[0];
    }
  }

  changeField(fieldId) {
    this.field.field = fieldId; 
  }

  changeLine(line) {
    this.field.line = line;
  }

  setValue(value) {
    this.components[this.field.pm].setValue(this.field, value);
  }

  getArray(size: number): any[] {
    return [...Array(size)];
  }

}
