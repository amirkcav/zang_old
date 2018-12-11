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
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/components/common/messageservice';

import { AlertsService } from '../alerts.service'

@Component({
  selector: 'dynamic-form',
  templateUrl: './dynamic-form.component.html',
  providers: [QuestionControlService, QuestionService, ConfirmationService, AlertsService, MessageService] 
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

  formValueHolder: any;

  flattendFields: QuestionBase<any>[];

  // tslint:disable-next-line:max-line-length
  constructor(private service: QuestionControlService, private confirmationService: ConfirmationService, private alertsService: AlertsService) {} // private messageService: MessageService, 

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
        if (response.status !== 'ok') {
          this.alertsService.alert('error', '', response.message);
        }
        else {
          this.alertsService.alert('success', 'המידע נשמר בהצלחה', '');
          this.onSaved.emit({ formKey: this.formKey, values: response });
        }
      })
      .catch((err) => {
        this.alertsService.alert('error', 'אירעה שגיאה', err, false);
      });
  }

  onCancel() {
    if (this.form.dirty) {
      this.confirmationService.confirm({
        header: 'התנתקות',
        message: 'האם אתה בטוח?',
        accept: () => {
          this.onCancelled.emit(this.form.dirty);
        }
      });
    }
    else {
      this.onCancelled.emit(this.form.dirty);
    }
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
    })
    .catch((err) => {
        this.alertsService.alert('error', 'אירעה שגיאה', err, false);
    });
  }

  setValue(field: Field, value: any) {
    this.form.controls[field.field].setValue(value);
  }

}
