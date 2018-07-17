import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DynamicGridComponent } from 'app/dynamic-form/dynamic-grid.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  display = 'grid-a';
  gridClass = 'material';
  gridLimit: 5;
  gridScrollbarH = false;
  gridScrollbarV = false;

  gridParams = {
    class: this.gridClass,
    limit: this.gridLimit,
    scrollbarH: this.gridScrollbarH,
    scrollbarV: this.gridScrollbarV
  };

  constructor() {}

  ngOnInit() {}

  onSaved(formKey: string, values: any) {
    alert('Form ' + formKey + ' saved: ' + JSON.stringify(values));
  }

  onCancelled(formKey: string) {
    alert('Form ' + formKey + ' cancelled');
  }

  onClicked(event: any) {

  }

  updateGrid() {
    this.gridParams = {
      class: this.gridClass,
      limit: this.gridLimit,
      scrollbarH: this.gridScrollbarH,
      scrollbarV: this.gridScrollbarV
    };
  }
}
