import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  onSaved(formKey: string, values: any) {
    alert('Form ' + formKey + ' saved: ' + JSON.stringify(values));
  }

  onCancelled(formKey: string) {
    alert('Form ' + formKey + ' cancelled');
  }
}
