import { Injectable } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
  ValidatorFn,
  AsyncValidatorFn,
  AbstractControl
} from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { QuestionBase } from './question-base';
import { QuestionService } from './question.service';
import { FormValidationResponse } from './form-validation-response';

/**
 * Handles the reactive form creation and validation.
 */
@Injectable()
export class QuestionControlService {
  constructor(private service: QuestionService) {}

  /**
   * @param  {string} The key (identifier) of the form, at the server
   * @return {Promise} A promise with array of questions.
   */
  getQuestions(
    formKey: string,
    formParameters: any
  ): Promise<QuestionBase<any>[]> {
    return this.service.getQuestions(formKey, formParameters);
  }

  save(
    formKey: string,
    formParameters: any,
    formValues: any
  ): Promise<FormValidationResponse> {
    return this.service.save(formKey, formParameters, formValues);
  }

  /**
   * Generates a FormGroup from the given questions, and sets the server validation
   * for the form
   * @param  {QuestionBase<any>[]} The questions returned from the service
   * @param  {string} The key (identifier) of the form
   * @return {FormGroup}
   */
  toFormGroup(questions: QuestionBase<any>[], formKey: string): FormGroup {
    const group: any = {};
    // Observable FormValidationResponse
    const formValidationResponse = new Subject<FormValidationResponse>();

    const formValidationResponse$ = formValidationResponse.asObservable();

    questions.forEach(question => {
      const serverValidator = this.serverValidator(
        formValidationResponse,
        formKey,
        question.key
      );
      const syncValidators = question.required ? [Validators.required] : [];
      group[question.key] = new FormControl(
        question.value || '',
        syncValidators,
        serverValidator
      );
    });
    const formGroup = new FormGroup(group);
    formValidationResponse$.subscribe(data => {
      // console.log('Received validation response ' + data);
      if (data.values) {
        formGroup.patchValue(data.values);
      }
    });
    return formGroup;
  }

  /**
   * Validator factory method, which create a server validator for a given field
   * @param  {Subject<FormValidationResponse>} The subject to publish to, once the server return validation response
   * @param  {string} The form id
   * @param  {string} The field id
   * @return {AsyncValidatorFn} the generated validator function
   */
  serverValidator(
    formData: Subject<FormValidationResponse>,
    formKey: string,
    fieldName: string
  ): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
      if (control.pristine) {
        // If this is not a user change - don't validate
        return Promise.resolve(null);
      }
      // console.log('validate'); // for demo purposes only
      const self = this;
      return this.service
        .validateControl(formKey, fieldName, control.value)
        .then(response => {
          // console.log('validated: ' + response); // for demo purposes only

          if (response.status === 'ok') {
            // Set the values received from the server in the form model and reload it.
            setTimeout(() => {
              formData.next(response);
            });
            return null;
          } else {
            // Server did not validate
            return { serverError: { message: response.message } };
          }
        });
    };
  }
}
