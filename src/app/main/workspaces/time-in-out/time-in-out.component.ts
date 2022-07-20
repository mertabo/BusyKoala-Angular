import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-time-in-out',
  templateUrl: './time-in-out.component.html',
  styleUrls: ['./time-in-out.component.css'],
})
export class TimeInOutComponent implements OnInit {
  @Input() timeInOutData: any;
  @Input() date: any;
  times: string[][] = [];
  currentlyTimedIn: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.timeInOutData.time.forEach((time: string) => {
      let processedTime = time.split(' - ');
      if (processedTime.length < 2) {
        processedTime.push('');
        this.currentlyTimedIn = true;
      }
      this.times.push(processedTime);
    });
  }
}
