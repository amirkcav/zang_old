import { Injectable }       from '@angular/core';
import { isDevMode } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { environment } from '../../environments/environment';

import 'rxjs/add/operator/toPromise';
import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';

import { DropdownQuestion } from './question-dropdown';
import { QuestionBase }     from './question-base';
import { TextboxQuestion }  from './question-textbox';

import { FormValidationResponse }      from './form-validation-response'

@Injectable()
export class QuestionService {

  private readonly baseDevUrl = environment.dynamicFormBaseDevUrl || 'http://cache.cav.local:8080/zang/app/';

  private headers = new Headers({'Content-Type': 'application/json'});

  private readonly questionsUrl = environment.dynamicFormQuestionsUrl || '../mcall?_NS=USER&_ROUTINE=ZANGDEMO&_LABEL=FORM';  // Get the session info

  private readonly validateUrl = environment.dynamicFormValidateUrl || '../mcall?_NS=USER&_ROUTINE=ZANGDEMO&_LABEL=VALIDATE';  // Get the session info

  private readonly saveUrl = environment.dynamicFormSaveUrl || '../mcall?_NS=USER&_ROUTINE=ZANGDEMO&_LABEL=SAVE';  // Get the session info

  constructor(private http: Http) { }

  getQuestions(formKey: string, formParameters: any) : Promise<QuestionBase<any>[]> {
    let url = this.getUrl(this.questionsUrl);
    let data = { 'FORM': formKey, 'PARAMS': formParameters };

    return this.http.post(
      url,
      JSON.stringify(data),
      {headers: this.headers}
      )
    .toPromise()
    .then(response => {
      let res = response.json() as ServiceResponse;
      if (res.status !== 'ok') {
        return this.handleError(res);
      }
      let data: any[] = res.data as any[] || [];
      return data.map(item => this.createQuestion(item));
      // return res.data as QuestionBase<any>[];
    })
    .catch(this.handleError);
  }

  save(formKey: string, formParameters: any, formValues: any) : Promise<FormValidationResponse> {
    let url = this.getUrl(this.saveUrl);
    let data = { 'FORM': formKey, 'PARAMS': formParameters, 'VALUES': formValues };

    return this.http.post(
      url,
      JSON.stringify(data),
      {headers: this.headers}
      )
    .toPromise()
    .then(response => {
      let res = response.json() as ServiceResponse;
      if (res.status !== 'ok') {
        return this.handleError(res);
      }
      return res.data as FormValidationResponse;
    })
    .catch(this.handleError);

  }

  private handleError(error: any) : Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  validateControl(formKey: string, field: string, value: string) : Promise<FormValidationResponse> {
    let url = this.getUrl(this.validateUrl);
    let data = { 'FORM': formKey, 'FIELD': field, 'VALUE': (value === null ? "" : value) };

    return this.http.post(
      url,
      JSON.stringify(data),
      {headers: this.headers}
      )
    .toPromise()
    .then(response => {
      let res = response.json() as ServiceResponse;
      if (res.status !== 'ok') {
        return this.handleError(res);
      }
      return res.data as FormValidationResponse;
    })
    .catch(this.handleError);
  }

  createQuestion(options: {} = {}) : QuestionBase<string> {
    // TODO: unsafe code - wshould use switch of string enum, or if/else on specific Question classes.
    var clazz = options['class'];
    if (clazz === 'TextboxQuestion') {
      return new TextboxQuestion(options);
    }
    else if (clazz === 'DropdownQuestion') {
      return new DropdownQuestion(options);
    }
    // var instance = Object.create(window[name].prototype);
    // instance.constructor.apply(instance, options);
    return null as QuestionBase<string>;
  }

  getQuestionsOrig() {

    let questions: QuestionBase<any>[] = [

    new DropdownQuestion({
      key: 'brave',
      label: 'Bravery Rating',
      options: [
      {key: 'solid',  value: 'Solid'},
      {key: 'great',  value: 'Great'},
      {key: 'good',   value: 'Good'},
      {key: 'unproven', value: 'Unproven'}
      ],
      order: 3
    }),

    new TextboxQuestion({
      key: 'firstName',
      label: 'First name',
      value: 'Bombasto',
      required: true,
      order: 1
    }),

    new TextboxQuestion({
      key: 'emailAddress',
      label: 'Email',
      type: 'email',
      order: 2
    })
    ];

    return questions.sort((a, b) => a.order - b.order);
  }

  getUrl(originalUrl: string) : string {
    if (isDevMode()) {
      return this.baseDevUrl + originalUrl + '&JB=123456&_USERNAME=1&_PASSWORD=1';
    }
    return originalUrl;
  }

}

class ServiceResponse {
  status: string;
  message: string;
  data: object;

  toString() : string {
    if (this.status === 'ok') {
      return 'ok: ' + this.data;
    }
    // Not Ok
    return 'error (' + this.status + '): ' + this.message;
  }
}
