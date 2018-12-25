import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class MyLoaderService {

  static showLoaderSubject = new Subject<any>();  

  constructor() { }

  show(message?: string) {
    MyLoaderService.showLoaderSubject.next({show: true, message: message});
  }

  hide() {
    MyLoaderService.showLoaderSubject.next({show: false});
  }

}
