import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ViewChildren } from '@angular/core';
import { QuestionService } from 'app/dynamic-form/question.service';
import { TabView } from 'primeng/tabview';

// The animObj is declared in assets/animatedScrollTo.js. 
// watch https://www.thepolyglotdeveloper.com/2016/01/include-external-javascript-libraries-in-an-angular-2-typescript-project/
declare var animObj: any;

@Component({
  selector: 'app-dynamic-multi-apps',
  templateUrl: './dynamic-multi-apps.component.html',
  styleUrls: ['./dynamic-multi-apps.component.css'],
  providers: [QuestionService]
})
export class DynamicMultiAppsComponent implements OnInit {

  @ViewChild('tabs') tabs: TabView

  @ViewChildren('app, appA') apps: any;

  @Input() key: string;
  @Input() params: any = null;

  @Output() onFormSaved  = new EventEmitter<any>();

  data: any[];
  selectedTab: string;

  anim = new animObj();

  useScroll = true;

  constructor(private service: QuestionService) { }

  ngOnInit() {
    this.initApps();
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
    
    // animatedScrollTo(document.querySelector('#tabs-content'), tabOffset - parentOffset, 500);
    this.anim.animatedScrollTo(document.querySelector('#tabs-content'), tabOffset - parentOffset, 500);
    
    this.selectedTab = tabId;
  }

  useScrollChanged(value) {
    this.useScroll = value;
  }

  saveAll(event) {
    const r = 3;
  }

}
