import { Injectable }   from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, ValidatorFn, AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { QuestionBase } from './question-base';
import { QuestionService } from './question.service';
import { FormValidationResponse }      from './form-validation-response'

@Injectable()
export class QuestionControlService {
	constructor(private service: QuestionService) { }

	getQuestions(formKey: string) : Promise<QuestionBase<any>[]> {
		return this.service.getQuestions(formKey);
	}

	toFormGroup(questions: QuestionBase<any>[], formKey: string) : FormGroup {
		let group: any = {};
		// Observable FormValidationResponse 
		let formValidationResponse = new Subject<FormValidationResponse>();  

		let formValidationResponse$ = formValidationResponse.asObservable();

		questions.forEach(question => {
			let serverValidator = this.serverValidator(formValidationResponse, formKey, question.key);
			let syncValidators = question.required ? [Validators.required] : [];
			group[question.key] = new FormControl(question.value || '', syncValidators, serverValidator);
		});
		let formGroup = new FormGroup(group);
		formValidationResponse$.subscribe(
			data => {
				// console.log('Received validation response ' + data);
				if (data.values) {
					formGroup.patchValue(data.values);					
				}
			});
		return formGroup;
	}

	serverValidator(formData: Subject<FormValidationResponse>, formKey: string, fieldName: string): AsyncValidatorFn {
		return (control: AbstractControl) : Promise<{[key : string] : any}>|Observable<{[key : string] : any}> => {
			//if (control.pristine || control.untouched) {
			if (control.pristine) {
				// If this is not a user change - don't validate
				return Promise.resolve(null);
			}
			// console.log('validate'); // for demo purposes only
			const self = this;
			return this.service.validateControl(formKey, fieldName, control.value).
			then(response => {
				// console.log('validated: ' + response); // for demo purposes only

				if (response.status === 'ok') {
					// Set the values received from the server in the form model and reload it.
					setTimeout(() => {
						formData.next(response);
					});
					return null;
				}
				else {
					// Server did not validate
					return {'serverError': {message: response.message}};
				}
			});
		};
	}

}
