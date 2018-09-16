import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DynamicGridComponent } from 'app/dynamic-form/dynamic-grid.component';
import { FormsModule } from '@angular/forms';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { QuestionService } from 'app/dynamic-form/question.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ],
  providers: [ QuestionService ]
})
export class AppComponent implements OnInit {
  display = 'app';
  gridClass = 'material';
  gridLimit: 5;
  gridScrollbarH = false;
  gridScrollbarV = false;

  menuItems: MenuItem[];

  gridParams = {
    class: this.gridClass,
    limit: this.gridLimit,
    scrollbarH: this.gridScrollbarH,
    scrollbarV: this.gridScrollbarV
  };

  constructor(private service: QuestionService) {}

  ngOnInit() {
    this.service.loadMenuJson().then(response => {
      this.menuItems = response;
    });
  }

  onSaved(formData: any) {
    alert('Form ' + formData.formKey + ' saved: ' + JSON.stringify(formData.values));
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
