import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { QuestionBase } from './question-base';

@Component({
  selector: 'df-question',
  templateUrl: './dynamic-form-question.component.html'
})
export class DynamicFormQuestionComponent {
  @Input() question: QuestionBase<any>;

  @Input() form: FormGroup;

  @Input() validateOnBlur: boolean;

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
}
