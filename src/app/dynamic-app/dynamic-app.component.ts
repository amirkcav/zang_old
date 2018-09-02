import { Component, OnInit } from '@angular/core';
import { App } from './dynamic-app.model' 
import { QuestionService } from '../dynamic-form/question.service';
import { ConfirmationService } from 'primeng/api';

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

  // because id of element can't start with a number.
  pageIdPrefix = 'page-';

  constructor(private service: QuestionService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.service.getApp('A', '').then((response) => {
      this.data = <App>response;
      this.dataHolder = JSON.parse(JSON.stringify(this.data));
      this.selectedTab = this.pageIdPrefix + this.data.pages[0].id;
    });
  }

  selectTab(event: any, tabId: string) {
    // code is needed (not using scrollIntoView()) so that the scrolling would be animated.
    const parentOffset = (document.querySelector('#tabs-content') as HTMLElement).offsetTop;
    const tabOffset = (document.querySelector('#' + tabId) as HTMLElement).offsetTop;
    this.anim.animatedScrollTo(document.querySelector('#tabs-content'), tabOffset - parentOffset, 500);
    // (document.querySelector('#' + tabId) as HTMLElement).scrollIntoView();

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

  scroll(a) {
    const tt =  4;
  }
}
