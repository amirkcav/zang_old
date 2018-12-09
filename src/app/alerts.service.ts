import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { MessageService } from 'primeng/components/common/messageservice';

@Injectable()
export class AlertsService {

  constructor(private messageService: MessageService) { }

  public alert(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail });    
    setTimeout(() => {
      this.messageService.clear();
    }, 2500);
  }

}
