import { Injectable } from '@angular/core';
import { isDevMode } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { DropdownQuestion } from './question-dropdown';
import { QuestionBase } from './question-base';
import { TextboxQuestion } from './question-textbox';

import { Grid } from './grid';

import { FormValidationResponse } from './form-validation-response';

@Injectable()
export class QuestionService {
  private readonly baseDevUrl = environment.dynamicFormBaseDevUrl ||
    'http://cache.cav.local:8080/zang/app/';

  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  private readonly questionsUrl = environment.dynamicFormQuestionsUrl ||
    '../mcall?_NS=USER&_ROUTINE=ZANGDEMO&_LABEL=FORM'; // Get the session info

  private readonly validateUrl = environment.dynamicFormValidateUrl ||
    '../mcall?_NS=USER&_ROUTINE=ZANGDEMO&_LABEL=VALIDATE'; // Get the session info

  private readonly saveUrl = environment.dynamicFormSaveUrl ||
    '../mcall?_NS=USER&_ROUTINE=ZANGDEMO&_LABEL=SAVE'; // Get the session info

  private readonly gridUrl = environment.dynamicGridUrl ||
    '../mcall?_NS=USER&_ROUTINE=ZANGDEMO&_LABEL=GRID'; // Get the session info

  private readonly gridDataUrl = environment.dynamicGridDataUrl ||
    '../mcall?_NS=USER&_ROUTINE=ZANGDEMO&_LABEL=GRIDDATA'; // Get the session info

  constructor(private http: HttpClient) {}

  getQuestions(
    formKey: string,
    formParameters: any
  ): Promise<QuestionBase<any>[]> {
    const url = this.getUrl(this.questionsUrl);
    const data = { FORM: formKey, PARAMS: formParameters };

    return this.http
      .post(url, JSON.stringify(data), { headers: this.headers })
      .toPromise()
      .then(response => {
        const res = response as ServiceResponse;
        if (res.status !== 'ok') {
          return this.handleError(res);
        }
        const resData: any[] = (res.data as any[]) || [];
        return resData.map(item => this.createQuestion(item));
        // return res.data as QuestionBase<any>[];
      })
      .catch(this.handleError);
  }

  save(
    formKey: string,
    formParameters: any,
    formValues: any
  ): Promise<FormValidationResponse> {
    // convert the null values to empty strings ("")
    for (const key in formValues) {
      if (formValues[key] === null) {
        formValues[key] = '';
      }
    }

    const url = this.getUrl(this.saveUrl);
    const data = {
      FORM: formKey,
      PARAMS: formParameters === null ? {} : formParameters,
      VALUES: formValues
    };

    return this.http
      .post(url, JSON.stringify(data), { headers: this.headers })
      .toPromise()
      .then(response => {
        const res = response as ServiceResponse;
        if (res.status !== 'ok') {
          return this.handleError(res);
        }
        return res.data as FormValidationResponse;
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  validateControl(
    formKey: string,
    field: string,
    value: string
  ): Promise<FormValidationResponse> {
    const url = this.getUrl(this.validateUrl);
    const data = {
      FORM: formKey,
      FIELD: field,
      VALUE: value === null ? '' : value
    };

    return this.http
      .post(url, JSON.stringify(data), { headers: this.headers })
      .toPromise()
      .then(response => {
        const res = response as ServiceResponse;
        if (res.status !== 'ok') {
          return this.handleError(res);
        }
        return res.data as FormValidationResponse;
      })
      .catch(this.handleError);
  }

  createQuestion(options: {} = {}): QuestionBase<string> {
    // TODO: unsafe code - wshould use switch of string enum, or if/else on specific Question classes.
    const clazz = options['class'];
    if (clazz === 'TextboxQuestion') {
      return new TextboxQuestion(options);
    } else if (clazz === 'DropdownQuestion') {
      return new DropdownQuestion(options);
    }
    // var instance = Object.create(window[name].prototype);
    // instance.constructor.apply(instance, options);
    return null as QuestionBase<string>;
  }

  getGrid(
    gridKey: string,
    gridParameters: any
  ): Promise<Grid> {
    const url = this.getUrl(this.gridUrl);
    const data = { GRID: gridKey, PARAMS: gridParameters };

    return this.http
      .post(url, JSON.stringify(data), { headers: this.headers })
      .toPromise()
      .then(response => {
        const res = response as ServiceResponse;
        if (res.status !== 'ok') {
          return this.handleError(res);
        }
        const resData: any = (res.data as any) || {};
        return new Grid(resData);
      })
      .catch(this.handleError);
  }

  getGridData(
    gridKey: string,
    gridParameters: any
  ): Promise<any[]> {
    const url = this.getUrl(this.gridDataUrl);
    const data = { GRID: gridKey, PARAMS: gridParameters };

    return this.http
      .post(url, JSON.stringify(data), { headers: this.headers })
      .toPromise()
      .then(response => {
        const res = response as ServiceResponse;
        if (res.status !== 'ok') {
          return this.handleError(res);
        }
        const resData: any[] = (res.data as any[]) || [];
        return resData;
      })
      .catch(this.handleError);
  }

  getUrl(originalUrl: string): string {
    if (isDevMode()) {
      return (
        this.baseDevUrl + originalUrl + '&JB=123456&_USERNAME=1&_PASSWORD=1'
      );
    }
    return originalUrl;
  }
}

class ServiceResponse {
  status: string;
  message: string;
  data: object;

  toString(): string {
    if (this.status === 'ok') {
      return 'ok: ' + this.data;
    }
    // Not Ok
    return 'error (' + this.status + '): ' + this.message;
  }
}
