import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs/Subject';

import { QuestionBase } from './question-base';

import { QuestionControlService } from './question-control.service';
import { QuestionService } from './question.service';
import { ISetValue, Field } from '../inetrfaces';

@Component({
  selector: 'dynamic-form',
  templateUrl: './dynamic-form.component.html',
  providers: [QuestionControlService, QuestionService]
})
export class DynamicFormComponent implements OnInit, OnChanges, ISetValue {
  @Input() formKey: string;
  @Input() validateOnBlur: boolean;
  @Input() formParameters: any = null;
  @Input() cancelButton: string = null;
  @Input() saveButton = 'שמור';
  @Input() isRtl = false;

  @Output() onSaved = new EventEmitter<any>();
  @Output() onCancelled = new EventEmitter<any>();

  questions: QuestionBase<any>[] = [];
  form: FormGroup;
  formTitle: string;

  loadingQuestions: Promise<any>;

  readonly: boolean;

  constructor(private service: QuestionControlService) {}

  ngOnChanges() {
    this.initForm();
  }

  ngOnInit() {
    // this.initForm();
  }

  onSubmit() {
    this.service
      .save(this.formKey, this.formParameters, this.form.value)
      .then(response => {
        this.onSaved.emit({ formKey: this.formKey, values: response });
      });
  }

  onCancel() {
    this.onCancelled.emit();
  }

  initForm(): void {
    this.loadingQuestions = this.service.getQuestions(
      this.formKey,  
      this.formParameters
    );
    this.loadingQuestions.then(response => {
      this.questions = response.questions;
      this.form = this.service.toFormGroup(this.questions, this.formKey, this.validateOnBlur);
      this.formTitle = response.formTitle;
      this.readonly = true;
      for (const question of this.questions) {
        if (!question.readonly) {
          this.readonly = false;
          break;
        }
      }
    });
  }

  setValue(field: Field, value: any) {
    this.form.controls[field.field].setValue(value);
  }

}
