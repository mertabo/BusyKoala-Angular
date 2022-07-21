import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { intervalToDuration } from 'date-fns';
import { militaryToStandardTimeFormat } from 'src/app/shared/utils/date';
import { AGE_SUFFIX, TIME_SEPARATOR } from '../../constants/calendar';

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
    const date = new Date(
      this.date + ' ' + this.times[this.times.length - 1][0]
    );
    const now = new Date();

    // get time out
    let time = militaryToStandardTimeFormat(now);

    // get duration
    let duration = '';
    const durationObj = intervalToDuration({
      start: new Date(
        `${this.date} ${this.timeInOutData.time[0].split(TIME_SEPARATOR)[0]}`
      ),
      end: now,
    });

    const durationArr = Object.values(durationObj);

    for (let i = 0; i < AGE_SUFFIX.length; i++) {
      if (durationArr[i])
        duration += `${durationArr[i]}${AGE_SUFFIX[i]}${
          durationArr[i] > 1 ? 's' : ''
        } `;
    }
    duration = duration.trim();
    if (!duration) duration = '0mins';

    let tempTime = this.timeInOutData.time;
    tempTime[tempTime.length - 1] += ` - ${time}`;

    const tempData = {
      ...this.timeInOutData,
      time: [...tempTime],
      duration,
    };

    this.currentlyTimedIn = false;
    this.times[this.times.length - 1][1] = time;
    this.timed.emit({ date, tempData });
  }

  constructor() {}

  ngOnInit(): void {
    this.timeInOutData = this.timeInOutData;
    this.fillTimes();
  }
}
