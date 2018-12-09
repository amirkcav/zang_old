import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { MessageService } from 'primeng/components/common/messageservice';

@Injectable()
export class AlertsService {
  timeout: any;

  constructor(private messageService: MessageService) { }

  public alert(severity: string, summary: string, detail: string) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.messageService.add({ severity: severity, summary: summary, detail: detail });    
    this.timeout = setTimeout(() => {
      this.messageService.clear();
    }, 2500);
  }

}
