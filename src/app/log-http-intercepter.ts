import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

export class LogHttpIntercepter implements HttpInterceptor {
  constructor() {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const started = Date.now();
    console.log('Started: ' + started);
    return next.handle(req).do(event => {
      if (event instanceof HttpResponse) {
        const elapsed = Date.now() - started;
        console.log(`Request for ${req.urlWithParams} took ${elapsed} ms.`);
      }
    });
    // .catch(response => {
    //   console.error('Error', response);
    //   return Observable.throw(response);
    // });
  }
}
