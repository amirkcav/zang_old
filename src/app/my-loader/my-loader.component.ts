import { Component, OnInit, OnDestroy, trigger, transition, style, animate, Input } from '@angular/core';
import { MyLoaderService } from './my-loader.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-my-loader',
  templateUrl: './my-loader.component.html',
  styleUrls: ['./my-loader.component.css'],
  providers: [MyLoaderService],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({ opacity: 0 }),
          animate('300ms 100ms', style({ opacity: 1 }))
        ]),
        transition(':leave', [
          style({opacity: 1}),
          animate('300ms', style({opacity: 0}))
        ])
      ]
    )
  ]
})
export class MyLoaderComponent implements OnInit, OnDestroy {
  
  // @Input('delay') delay: number;

  show: boolean;
  message: string;
  defaultMessage = 'בטעינה...';

  subscriber: Subscription;

  constructor(private myLoaderService: MyLoaderService) {
    this.subscriber = MyLoaderService.showLoaderSubject.subscribe((data) => {
      this.show = data.show;
      this.message = data.message ? data.message : this.defaultMessage;
    });
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.subscriber.unsubscribe();
  }

}
