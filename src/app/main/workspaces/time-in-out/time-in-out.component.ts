import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { intervalToDuration } from 'date-fns';
import { militaryToStandardTimeFormat } from 'src/app/shared/utils/utils';
import {
  AGE_SUFFIX,
  TIME_SEPARATOR,
} from '../../../shared/constants/constants';

@Component({
  selector: 'app-time-in-out',
  templateUrl: './time-in-out.component.html',
  styleUrls: ['./time-in-out.component.css'],
})
export class TimeInOutComponent implements OnInit {
  @Input() timeInOutData: any;
  @Input() date: any;
  times: string[][] = [];
  @Output() timed = new EventEmitter();
  currentlyTimedIn: boolean = false;

  fillTimes(): void {
    this.timeInOutData.time.forEach((time: string) => {
      let processedTime = time.split(TIME_SEPARATOR);
      if (processedTime.length < 2) {
        processedTime.push('');
        this.currentlyTimedIn = true;
      }
      this.times.push(processedTime);
    });
  }

  timeOut(): void {
    const timeIn = new Date(
      this.date + ' ' + this.times[this.times.length - 1][0]
    );
    const timeOut = new Date();

    // get time out
    let newDuration = '';
    let time = militaryToStandardTimeFormat(timeOut);

    // get duration
    // let newDurationObj = intervalToDuration({
    //   start: timeIn,
    //   end: timeOut,
    // });

    // const durationArr = Object.values(newDurationObj);

    // for (let i = 0; i < AGE_SUFFIX.length; i++) {
    //   if (durationArr[i])
    //     newDuration += `${durationArr[i]}${AGE_SUFFIX[i]}${
    //       durationArr[i] > 1 ? 's' : ''
    //     } `;
    // }

    const newDurationDiff = [
      timeOut.getFullYear() - timeIn.getFullYear(),
      timeOut.getMonth() - timeIn.getMonth(),
      timeOut.getDate() - timeIn.getDate(),
      timeOut.getHours() - timeIn.getHours(),
      timeOut.getMinutes() - timeIn.getMinutes(),
    ];

    for (let i = 0; i < AGE_SUFFIX.length; i++) {
      if (newDurationDiff[i])
        newDuration += `${newDurationDiff[i]} ${AGE_SUFFIX[i]}${
          newDurationDiff[i] > 1 ? 's' : ''
        } `;
    }

    newDuration = newDuration.trim();
    if (!newDuration) newDuration = '0 mins';

    // add current duration and new duration
    let currentDurationDiff = this.timeInOutData.duration.split(' ');

    console.log(newDuration);

    let tempTime = this.timeInOutData.time;
    tempTime[tempTime.length - 1] += ` - ${time}`;

    const tempData = {
      ...this.timeInOutData,
      time: [...tempTime],
      duration: newDuration,
    };

    this.currentlyTimedIn = false;
    this.times[this.times.length - 1][1] = time;
    this.timed.emit({ date: timeIn, tempData });
  }

  constructor() {}

  ngOnInit(): void {
    this.timeInOutData = this.timeInOutData;
    this.fillTimes();
  }
}
