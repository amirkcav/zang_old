import { Component, Input, OnInit, OnChanges }  from '@angular/core';
import { FormGroup }                 from '@angular/forms';
import { Subject } from 'rxjs/Subject';

import { QuestionBase }              from './question-base';

import { QuestionControlService } from './question-control.service'
import { QuestionService } from './question.service'

@Component({
  selector: 'dynamic-form',
  templateUrl: './dynamic-form.component.html',
  providers: [ QuestionControlService, QuestionService ]
})
export class DynamicFormComponent implements OnInit, OnChanges {

  @Input() formKey: string;
  @Input() validateOnBlur: boolean;
  @Input() formParameters: any = null;
  
  questions: QuestionBase<any>[] = [];
  form: FormGroup;
  payLoad = '';

  constructor(private service: QuestionControlService) { }

  ngOnChanges() {
    this.initForm();
  }

  ngOnInit() {
    this.initForm();

  }

  onSubmit() {
    this.payLoad = JSON.stringify(this.form.value);
  }

  initForm() : void {
    this.service.getQuestions(this.formKey, this.formParameters).then(response => {
      this.questions = response;
      this.form = this.service.toFormGroup(this.questions, this.formKey);
    });

  }
}
