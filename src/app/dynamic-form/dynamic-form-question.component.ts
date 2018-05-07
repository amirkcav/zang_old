import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { QuestionBase } from './question-base';
//import { QuestionControlService } from './question-control.service';
import { QuestionService } from './question.service';

@Component({
  selector: 'df-question',
  templateUrl: './dynamic-form-question.component.html',
  providers: [QuestionService]
})
export class DynamicFormQuestionComponent {
  @Input() question: QuestionBase<any>;
  @Input() form: FormGroup;
  @Input() validateOnBlur: boolean;

  @Input() formKey: string;

  autoCompleteSearch: Promise<any>;

  constructor(private service: QuestionService) {}

  get isInvalid() {
    const control = this.form.controls[this.question.key];
    if (!control) {
      return false;
    }
    return control.invalid && (control.dirty || control.touched);
  }

  get errors() {
    const control = this.form.controls[this.question.key];
    if (!control) {
      return {};
    }
    return control.errors || {};
  }

  currYear: number = new Date().getFullYear();
  results: object[];

  search(event) {
    var q = event.query;

    this.autoCompleteSearch = this.service.autoCompleteSearch(
      this.formKey,
      this.question.key,
      q
    );
    this.autoCompleteSearch.then(response => {
      //this.results = this._allResults.filter(r => r['value'].toLocaleLowerCase().indexOf(q) >= 0);
      this.results = response;
    });

  }
}
