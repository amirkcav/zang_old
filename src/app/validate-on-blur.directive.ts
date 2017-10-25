import { Directive, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
	selector: '[appValidateOnBlur]',
	host: {
		'(focus)': 'onFocus($event)',
		'(blur)': 'onBlur($event)',
		'(keyup)': 'onKeyup($event)',
		'(change)': 'onChange($event)',
		'(ngModelChange)': 'onNgModelChange($event)'
	}
})
export class ValidateOnBlurDirective {

	private validators: any;
	private asyncValidators: any;
	private wasChanged: any;
	
	@Input('appValidateOnBlur') isActive: boolean;

	constructor(public formControl: NgControl) {
	}

	onFocus($event) {
		if (this.isActive) {
			this.wasChanged = false;
			// Save the validators on the first time the control gets focus
			this.validators = this.validators || this.formControl.control.validator;
			this.asyncValidators = this.asyncValidators || this.formControl.control.asyncValidator;
			this.formControl.control.clearAsyncValidators();
			this.formControl.control.clearValidators();			
		}
	}

	onKeyup($event) {
		if (this.isActive) {
			this.wasChanged = true; // keyboard change
		}
	}

	onChange($event) {
		//this.wasChanged = true; // copypaste change
	}

	onNgModelChange($event) {
		//this.wasChanged = true; // ng-value change
	}

	onBlur($event) {
		if (this.isActive) {
			this.formControl.control.setAsyncValidators(this.asyncValidators);
			this.formControl.control.setValidators(this.validators);
			if (this.wasChanged) {
				this.formControl.control.updateValueAndValidity();

				// Clear the validators, so the control isn't validated again as the data is set from the server response.
				this.formControl.control.clearAsyncValidators();
				this.formControl.control.clearValidators();
				this.wasChanged = false;			
			}
		}
	}

}
