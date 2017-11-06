import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params, Router }   from '@angular/router';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  // template: `
  // <div>
  // <h2>Demo of M-based dynamic forms</h2>
  // <dynamic-form [formKey]="'A'"></dynamic-form>
  // <dynamic-form [formKey]="'B'"></dynamic-form>
  // </div>
  // `,
})
export class AppComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onSaved(formKey: string, values: any) {
    alert("Form " + formKey + " saved: " + JSON.stringify(values));
  }
}
